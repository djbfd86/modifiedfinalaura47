import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { generateAuraDates } from '../utils/auraCalculation';
import DatePicker from './DatePicker';
import TaskItem from './TaskItem';
import { ArrowLeft, Plus, Folder, CheckSquare, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

const FolderPage = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [lastEndDate, setLastEndDate] = useState(null);
  const [todaysTasks, setTodaysTasks] = useState([]);

  const collectionName = `folder-${folderId}`;

  useEffect(() => {
    const q = query(collection(db, collectionName), orderBy('serialNumber'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData = [];
      querySnapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() });
      });
      setTasks(tasksData);
      
      if (tasksData.length > 0) {
        setLastEndDate(new Date(tasksData[tasksData.length - 1].endDate));
      }

      // Update today's tasks
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todaysTasks = tasksData.filter(task => {
        const taskDate = new Date(task.currentDate);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
      });
      setTodaysTasks(todaysTasks);
    });

    return () => unsubscribe();
  }, [collectionName]);

  const handleAddTask = () => {
    setShowDatePicker(true);
  };

  const handleDateSelect = async (endDate) => {
    try {
      const today = new Date();
      const auraDates = generateAuraDates(today, endDate);
      const serialNumber = tasks.length + 1;

      await addDoc(collection(db, collectionName), {
        serialNumber,
        endDate: endDate.toISOString(),
        currentDate: auraDates[1]?.toISOString() || today.toISOString(),
        currentAuraIndex: 0,
        text1: '',
        text2: '',
        image1: null,
        image2: null,
        createdAt: new Date().toISOString()
      });

      setShowDatePicker(false);
      setLastEndDate(endDate);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpdate = () => {
    setTasks(prev => [...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white w-fit"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Folder className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                      Folder Tasks
                    </h1>
                    <p className="text-slate-400 text-lg">
                      Manage tasks within this project folder
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAddTask}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12 px-6"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <CheckSquare className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Tasks in this folder</p>
                  <p className="text-2xl font-bold text-white">{tasks.length}</p>
                </div>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 ml-auto">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <Calendar className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Today's Tasks</p>
                  <p className="text-2xl font-bold text-white">{todaysTasks.length}</p>
                </div>
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 border-amber-500/30 ml-auto">
                  Due Today
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <CheckSquare className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Completion Rate</p>
                  <p className="text-2xl font-bold text-white">
                    {tasks.length > 0 ? Math.round(((tasks.length - todaysTasks.length) / tasks.length) * 100) : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Tasks Section */}
        {todaysTasks.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <h2 className="text-2xl font-semibold text-white">Today's Tasks</h2>
              <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                {todaysTasks.length} due today
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {todaysTasks.map((task) => (
                <div key={task.id} className="relative">
                  <div className="absolute -top-2 -right-2 z-10">
                    <Badge className="bg-amber-500 text-amber-900 border-amber-600 shadow-lg">
                      Due Today
                    </Badge>
                  </div>
                  <TaskItem 
                    task={task} 
                    collectionName={collectionName}
                    onUpdate={handleUpdate}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Tasks Grid */}
        {tasks.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-semibold text-white">All Tasks</h2>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                {tasks.length} total
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  collectionName={collectionName}
                  onUpdate={handleUpdate}
                />
              ))}
            </div>
          </div>
        ) : (
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Tasks Yet</h3>
              <p className="text-slate-400 mb-6">Create your first task in this folder to get started</p>
              <Button 
                onClick={handleAddTask} 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Task
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Date Picker Modal */}
        {showDatePicker && (
          <DatePicker
            onDateSelect={handleDateSelect}
            onCancel={() => setShowDatePicker(false)}
            defaultDate={lastEndDate}
          />
        )}
      </div>
    </div>
  );
};

export default FolderPage;