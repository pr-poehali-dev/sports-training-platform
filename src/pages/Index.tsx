import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';

interface User {
  name: string;
  email: string;
  avatar: string;
  streak: number;
  calories: number;
  workouts: number;
  level: number;
  isPremium: boolean;
}

interface WorkoutPlan {
  name: string;
  exercises: string[];
  duration: string;
  calories: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const Index = () => {
  const [user, setUser] = useState<User>({ 
    name: 'Анна Спортивная', 
    email: 'anna@fitness.pro',
    avatar: '/api/placeholder/150/150',
    streak: 12, 
    calories: 0, 
    workouts: 34,
    level: 7,
    isPremium: false
  });
  
  const [goal, setGoal] = useState('mass');
  const [frequency, setFrequency] = useState('3');
  const [mascotMood, setMascotMood] = useState('happy');
  const [dailyCalories, setDailyCalories] = useState({ consumed: 1850, target: 2200 });
  const [activeTab, setActiveTab] = useState('workout');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // ИИ-чат
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Привет! Я твой персональный фитнес-ассистент 🤖 Задавай любые вопросы о тренировках, питании и здоровом образе жизни!',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Маскот реакции
  const mascots = {
    happy: '🦅',
    excited: '🚀', 
    sleeping: '😴',
    angry: '😤',
    love: '😍'
  };

  // Продвинутые планы тренировок
  const workoutPlans: Record<string, WorkoutPlan> = {
    mass: {
      name: 'Набор мышечной массы',
      exercises: ['Приседания со штангой 4×8-10', 'Жим лежа 4×6-8', 'Становая тяга 3×5-6', 'Подтягивания 3×8-12', 'Жим стоя 3×8-10'],
      duration: '75-90 мин',
      calories: 450,
      difficulty: 'hard'
    },
    loss: {
      name: 'Жиросжигание HIIT',
      exercises: ['Берпи 4×15', 'Горный альпинист 4×30сек', 'Прыжки через скакалку 5×60сек', 'Планка 3×60сек', 'Спринты 6×20сек'],
      duration: '45-50 мин',
      calories: 580,
      difficulty: 'medium'
    },
    cardio: {
      name: 'Кардио-выносливость',
      exercises: ['Легкий бег 25 мин', 'Велотренажер 20 мин', 'Эллипс 15 мин', 'Плавание 10 мин', 'Растяжка 10 мин'],
      duration: '80 мин',
      calories: 520,
      difficulty: 'easy'
    },
    strength: {
      name: 'Функциональная сила',
      exercises: ['Толчок гири 4×12', 'Фермерская походка 3×50м', 'Подъем по канату 3×5', 'Махи гирей 4×20', 'Турецкий подъем 3×5'],
      duration: '60-70 мин',
      calories: 420,
      difficulty: 'hard'
    }
  };

  // Расширенная таблица лидеров
  const leaderboard = [
    { name: 'Максим Железо', streak: 45, workouts: 128, level: 15, avatar: '💪' },
    { name: 'Елена Кардио', streak: 38, workouts: 95, level: 12, avatar: '🏃‍♀️' },
    { name: 'Дмитрий Силач', streak: 29, workouts: 87, level: 11, avatar: '🏋️‍♂️' },
    { name: user.name, streak: user.streak, workouts: user.workouts, level: user.level, avatar: '🦅' },
    { name: 'София Йога', streak: 22, workouts: 76, level: 9, avatar: '🧘‍♀️' },
    { name: 'Андрей Бег', streak: 18, workouts: 65, level: 8, avatar: '🏃‍♂️' }
  ].sort((a, b) => b.streak - a.streak);

  // Отметиться на тренировке
  const checkInWorkout = () => {
    setUser(prev => ({ 
      ...prev, 
      streak: prev.streak + 1, 
      workouts: prev.workouts + 1,
      level: Math.floor((prev.workouts + 1) / 5) + 1
    }));
    setMascotMood('excited');
    setTimeout(() => setMascotMood('love'), 2000);
    setTimeout(() => setMascotMood('happy'), 5000);
  };

  // ИИ-ответы
  const aiResponses = [
    'Отличный вопрос! Для начинающих рекомендую 3 тренировки в неделю с днем отдыха между ними. Это даст мышцам время восстановиться.',
    'Питание составляет 70% успеха! Старайся есть белок (1.6-2г на кг веса), сложные углеводы и не забывай про полезные жиры.',
    'Помни: прогресс не всегда линейный. Plateau - это нормально! Попробуй изменить программу или увеличить интенсивность.',
    'Качество сна крайне важно для восстановления. 7-9 часов качественного сна помогут достичь лучших результатов.',
    'Не сравнивай себя с другими! У каждого свой путь. Главное - быть лучше себя вчерашнего 💪',
    'Гидратация - ключ к хорошему самочувствию. Выпивай 30-35 мл воды на каждый кг веса ежедневно.',
    'Разминка и заминка - не опционально! 10-15 минут могут спасти от травм и ускорить восстановление.'
  ];

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      isUser: true,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Симуляция ответа ИИ
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        isUser: false,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const calorieProgress = (dailyCalories.consumed / dailyCalories.target) * 100;
  const levelProgress = ((user.workouts % 5) / 5) * 100;

  // Мобильная навигация
  const mobileNavItems = [
    { id: 'workout', icon: 'Dumbbell', label: 'Тренировки' },
    { id: 'calories', icon: 'Calculator', label: 'Калории' },
    { id: 'help', icon: 'MessageCircle', label: 'Помощь' },
    { id: 'leaderboard', icon: 'Trophy', label: 'Лидеры' },
    { id: 'profile', icon: 'User', label: 'Профиль' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Современный хедер */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-energetic-orange to-achievement-gold rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                F
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  FitTracker Pro
                </h1>
                {user.isPremium && (
                  <Badge className="text-xs bg-gradient-to-r from-fitness-purple to-athletic-blue text-white">
                    Premium
                  </Badge>
                )}
              </div>
            </div>

            {/* Десктоп навигация */}
            <div className="hidden md:flex items-center gap-6">
              <div className="streak-badge animate-pulse">
                <Icon name="Flame" size={16} />
                <span>{user.streak} дней</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-3xl animate-bounce">{mascots[mascotMood as keyof typeof mascots]}</div>
                <div className="text-sm">
                  <div className="font-medium">Уровень {user.level}</div>
                  <Progress value={levelProgress} className="w-16 h-2" />
                </div>
              </div>
              <Avatar className="w-10 h-10 border-2 border-energetic-orange">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>

            {/* Мобильное меню */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Icon name="Menu" size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-sm text-muted-foreground">Уровень {user.level}</div>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl">
                    <span>Серия тренировок</span>
                    <div className="streak-badge">
                      <Icon name="Flame" size={16} />
                      {user.streak}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-2xl">
                    <span>Маскот</span>
                    <div className="text-2xl">{mascots[mascotMood as keyof typeof mascots]}</div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Десктоп табы */}
          <TabsList className="hidden md:grid w-full grid-cols-6 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="workout" className="data-[state=active]:bg-energetic-orange data-[state=active]:text-white">
              <Icon name="Dumbbell" size={16} className="mr-2" />
              Тренировки
            </TabsTrigger>
            <TabsTrigger value="calories" className="data-[state=active]:bg-athletic-blue data-[state=active]:text-white">
              <Icon name="Calculator" size={16} className="mr-2" />
              Питание
            </TabsTrigger>
            <TabsTrigger value="help" className="data-[state=active]:bg-fitness-purple data-[state=active]:text-white">
              <Icon name="MessageCircle" size={16} className="mr-2" />
              ИИ Помощь
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-achievement-gold data-[state=active]:text-white">
              <Icon name="Trophy" size={16} className="mr-2" />
              Лидеры
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-gray-800 data-[state=active]:text-white">
              <Icon name="User" size={16} className="mr-2" />
              Профиль
            </TabsTrigger>
            <TabsTrigger value="support" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              <Icon name="Heart" size={16} className="mr-2" />
              Донат
            </TabsTrigger>
          </TabsList>

          {/* Тренировки - улучшенные */}
          <TabsContent value="workout" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
              {/* Настройка программы */}
              <Card className="workout-card lg:col-span-1">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Icon name="Settings" size={24} className="text-energetic-orange" />
                    Персональная программа
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Цель тренировок</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: 'mass', label: 'Масса', icon: 'TrendingUp', color: 'bg-blue-500' },
                          { value: 'loss', label: 'Похудение', icon: 'TrendingDown', color: 'bg-red-500' },
                          { value: 'cardio', label: 'Кардио', icon: 'Heart', color: 'bg-pink-500' },
                          { value: 'strength', label: 'Сила', icon: 'Zap', color: 'bg-purple-500' }
                        ].map(option => (
                          <Button
                            key={option.value}
                            variant={goal === option.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setGoal(option.value)}
                            className={`flex items-center gap-2 h-12 ${
                              goal === option.value ? option.color : ''
                            }`}
                          >
                            <Icon name={option.icon as any} size={16} />
                            <span className="text-xs">{option.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Частота (раз в неделю)</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {['2', '3', '4', '5'].map(freq => (
                          <Button
                            key={freq}
                            variant={frequency === freq ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFrequency(freq)}
                            className={`h-10 ${frequency === freq ? 'bg-athletic-blue' : ''}`}
                          >
                            {freq}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Сегодняшняя тренировка */}
              <Card className="workout-card lg:col-span-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Icon name="Target" size={24} className="text-athletic-blue" />
                      {workoutPlans[goal].name}
                    </h2>
                    <Badge className={`
                      ${workoutPlans[goal].difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                        workoutPlans[goal].difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}
                    `}>
                      {workoutPlans[goal].difficulty === 'easy' ? 'Легко' : 
                       workoutPlans[goal].difficulty === 'medium' ? 'Средне' : 'Сложно'}
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-xl p-3">
                      <Icon name="Clock" size={16} />
                      <span>{workoutPlans[goal].duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-xl p-3">
                      <Icon name="Flame" size={16} />
                      <span>~{workoutPlans[goal].calories} ккал</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 rounded-xl p-3">
                      <Icon name="BarChart3" size={16} />
                      <span>{workoutPlans[goal].exercises.length} упражнений</span>
                    </div>
                  </div>
                  
                  <div className="grid gap-2 mb-4">
                    {workoutPlans[goal].exercises.map((exercise, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-border/30">
                        <div className="w-8 h-8 bg-energetic-orange/20 text-energetic-orange rounded-full flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </div>
                        <span className="text-sm font-medium">{exercise}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={checkInWorkout} 
                    className="w-full bg-gradient-to-r from-energetic-orange to-achievement-gold hover:from-energetic-orange/90 hover:to-achievement-gold/90 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    size="lg"
                  >
                    <Icon name="Check" size={20} className="mr-2" />
                    Отметиться на тренировке
                    <div className="ml-2 animate-pulse">🔥</div>
                  </Button>
                </div>
              </Card>
            </div>

            {/* Недельный прогресс */}
            <Card className="workout-card">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Icon name="Calendar" size={20} />
                  Прогресс недели
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 7 }, (_, i) => {
                    const isCompleted = i < (user.streak % 7);
                    const isToday = i === 6;
                    return (
                      <div key={i} className="text-center space-y-2">
                        <div className="text-xs text-muted-foreground font-medium">
                          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][i]}
                        </div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-gradient-to-br from-energetic-orange to-achievement-gold text-white shadow-lg transform scale-110' 
                            : isToday
                            ? 'bg-muted border-2 border-energetic-orange border-dashed animate-pulse'
                            : 'bg-muted/50'
                        }`}>
                          {isCompleted ? '✓' : isToday ? '📅' : ''}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* ИИ Помощь - новая вкладка */}
          <TabsContent value="help" className="space-y-6">
            <Card className="workout-card h-[600px] flex flex-col">
              <div className="space-y-4 flex-1 flex flex-col">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-fitness-purple to-athletic-blue rounded-full flex items-center justify-center">
                    <Icon name="Bot" size={16} className="text-white" />
                  </div>
                  ИИ Фитнес-Помощник
                  <Badge className="bg-gradient-to-r from-fitness-purple to-athletic-blue text-white">
                    Beta
                  </Badge>
                </h2>
                
                <div className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl p-4 overflow-y-auto space-y-4 max-h-96">
                  {chatMessages.map(message => (
                    <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={message.isUser ? 'user-message' : 'ai-chat-message max-w-[80%]'}>
                        {!message.isUser && (
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-fitness-purple to-athletic-blue rounded-full flex items-center justify-center">
                              <Icon name="Bot" size={12} className="text-white" />
                            </div>
                            <span className="text-xs text-muted-foreground font-medium">Фитнес-ИИ</span>
                          </div>
                        )}
                        <p className="text-sm">{message.text}</p>
                        <div className={`text-xs ${message.isUser ? 'text-white/70' : 'text-muted-foreground'} mt-1`}>
                          {message.timestamp.toLocaleTimeString('ru-RU', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="ai-chat-message">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-fitness-purple to-athletic-blue rounded-full flex items-center justify-center animate-pulse">
                            <Icon name="Bot" size={12} className="text-white" />
                          </div>
                          <span className="text-xs text-muted-foreground font-medium">Печатает...</span>
                        </div>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex gap-2 flex-wrap">
                    {[
                      'Как начать тренировки?',
                      'Питание для набора массы',
                      'Упражнения для дома',
                      'Как избежать травм?'
                    ].map(suggestion => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => setNewMessage(suggestion)}
                        className="text-xs h-8"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Задайте вопрос о тренировках, питании, здоровье..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="resize-none min-h-12 max-h-24"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || isTyping}
                      className="bg-gradient-to-r from-fitness-purple to-athletic-blue hover:from-fitness-purple/90 hover:to-athletic-blue/90 min-w-12 h-12"
                    >
                      <Icon name="Send" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Остальные разделы остаются из исходного кода с небольшими улучшениями */}
          <TabsContent value="calories" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="workout-card">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Icon name="Target" size={24} className="text-achievement-gold" />
                    Дневная норма калорий
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <div className="text-4xl font-bold bg-gradient-to-r from-energetic-orange to-achievement-gold bg-clip-text text-transparent">
                        {dailyCalories.consumed}
                      </div>
                      <div className="text-muted-foreground">
                        из {dailyCalories.target} ккал
                      </div>
                    </div>
                    
                    <Progress value={calorieProgress} className="h-4" />
                    
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Белки', value: '125г', color: 'text-blue-500' },
                        { label: 'Жиры', value: '68г', color: 'text-yellow-500' },
                        { label: 'Углеводы', value: '210г', color: 'text-green-500' }
                      ].map(macro => (
                        <div key={macro.label} className="text-center p-3 bg-white/50 rounded-xl">
                          <div className="text-xs text-muted-foreground">{macro.label}</div>
                          <div className={`font-bold ${macro.color}`}>{macro.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="workout-card">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Добавить прием пищи</h3>
                  <div className="space-y-3">
                    <Input placeholder="Название блюда" />
                    <Input placeholder="Калории" type="number" />
                    <Button className="w-full bg-athletic-blue hover:bg-athletic-blue/90">
                      <Icon name="Plus" size={16} />
                      Добавить
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card className="workout-card">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Icon name="Trophy" size={24} className="text-achievement-gold" />
                  Таблица лидеров
                </h2>
                
                <div className="space-y-3">
                  {leaderboard.map((leader, idx) => (
                    <div key={leader.name} className={`flex items-center justify-between p-4 rounded-xl ${
                      leader.name === user.name ? 'bg-energetic-orange/10 border border-energetic-orange/20' : 'bg-muted/50'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                          idx === 0 ? 'bg-achievement-gold' : 
                          idx === 1 ? 'bg-gray-400' : 
                          idx === 2 ? 'bg-orange-600' : 'bg-athletic-blue'
                        }`}>
                          {idx < 3 ? ['🥇', '🥈', '🥉'][idx] : idx + 1}
                        </div>
                        <div>
                          <div className="font-medium">{leader.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {leader.workouts} тренировок • Уровень {leader.level}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{leader.avatar}</span>
                        <div className="streak-badge">
                          <Icon name="Flame" size={14} />
                          {leader.streak}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="workout-card">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 border-4 border-energetic-orange">
                    <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-energetic-orange to-achievement-gold text-white">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                    <Badge className="bg-athletic-blue mt-1">Уровень {user.level}</Badge>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-xl">
                    <div className="text-2xl font-bold text-energetic-orange">{user.streak}</div>
                    <div className="text-sm text-muted-foreground">Дней подряд</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-xl">
                    <div className="text-2xl font-bold text-athletic-blue">{user.workouts}</div>
                    <div className="text-sm text-muted-foreground">Тренировок</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-xl">
                    <div className="text-2xl font-bold text-achievement-gold">{user.level}</div>
                    <div className="text-sm text-muted-foreground">Уровень</div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-6">
            <Card className="workout-card">
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto">
                    <Icon name="Heart" size={32} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Поддержать FitTracker Pro</h2>
                  <p className="text-muted-foreground">
                    Наше приложение разрабатывается командой энтузиастов. Ваша поддержка поможет добавить новые функции!
                  </p>
                </div>
                
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    { amount: '150₽', desc: 'Кофе разработчику' },
                    { amount: '500₽', desc: 'Обед команды' },
                    { amount: '1500₽', desc: 'Премиум функции' }
                  ].map(option => (
                    <Button key={option.amount} variant="outline" className="h-auto p-6 flex-col gap-2">
                      <div className="text-2xl font-bold text-energetic-orange">{option.amount}</div>
                      <div className="text-sm text-muted-foreground text-center">{option.desc}</div>
                    </Button>
                  ))}
                </div>
                
                <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                  <h3 className="font-semibold">Реквизиты для донатов:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="font-medium">Сбербанк:</div>
                      <div className="text-sm text-muted-foreground">2202 2012 3456 7890</div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-medium">ЮMoney:</div>
                      <div className="text-sm text-muted-foreground">410012345678901</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center text-sm text-muted-foreground">
                  <Icon name="Shield" size={16} className="inline mr-1" />
                  Безопасные платежи через проверенные системы
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Мобильная навигация */}
      <nav className="mobile-nav md:hidden">
        <div className="grid grid-cols-5 gap-2">
          {mobileNavItems.map(item => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(item.id)}
              className={`flex-col h-auto py-2 px-1 ${
                activeTab === item.id 
                  ? 'bg-energetic-orange text-white' 
                  : 'text-muted-foreground'
              }`}
            >
              <Icon name={item.icon as any} size={18} />
              <span className="text-xs mt-1">{item.label}</span>
            </Button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Index;