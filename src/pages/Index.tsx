import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface User {
  name: string;
  streak: number;
  calories: number;
  workouts: number;
}

interface WorkoutPlan {
  name: string;
  exercises: string[];
  duration: string;
  calories: number;
}

const Index = () => {
  const [user, setUser] = useState<User>({ name: 'Фитнес Воин', streak: 7, calories: 0, workouts: 15 });
  const [goal, setGoal] = useState('mass');
  const [frequency, setFrequency] = useState('3');
  const [mascotMood, setMascotMood] = useState('happy');
  const [dailyCalories, setDailyCalories] = useState({ consumed: 1650, target: 2200 });
  
  // Маскот реакции
  const mascots = {
    happy: '🦅',
    excited: '🚀',
    sleeping: '😴',
    angry: '😤'
  };

  // Планы тренировок
  const workoutPlans: Record<string, WorkoutPlan> = {
    mass: {
      name: 'Набор массы',
      exercises: ['Приседания 4x12', 'Жим лежа 4x10', 'Становая тяга 4x8', 'Подтягивания 3x10'],
      duration: '60-75 мин',
      calories: 400
    },
    loss: {
      name: 'Похудение',
      exercises: ['Берпи 3x15', 'Планка 3x60сек', 'Прыжки 4x30сек', 'Альпинист 3x45сек'],
      duration: '45-60 мин',
      calories: 500
    },
    cardio: {
      name: 'Кардио',
      exercises: ['Бег 20 мин', 'Велотренажер 15 мин', 'Эллипс 10 мин', 'Растяжка 10 мин'],
      duration: '55 мин',
      calories: 450
    }
  };

  // Таблица лидеров
  const leaderboard = [
    { name: 'Анна К.', streak: 24, workouts: 45 },
    { name: 'Михаил Р.', streak: 18, workouts: 38 },
    { name: user.name, streak: user.streak, workouts: user.workouts },
    { name: 'Елена В.', streak: 12, workouts: 29 },
    { name: 'Дмитрий С.', streak: 9, workouts: 22 }
  ].sort((a, b) => b.streak - a.streak);

  // Отметиться на тренировке
  const checkInWorkout = () => {
    setUser(prev => ({ 
      ...prev, 
      streak: prev.streak + 1, 
      workouts: prev.workouts + 1 
    }));
    setMascotMood('excited');
    setTimeout(() => setMascotMood('happy'), 3000);
  };

  // Калькулятор калорий
  const calorieProgress = (dailyCalories.consumed / dailyCalories.target) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Хедер */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-energetic-orange rounded-full flex items-center justify-center text-white font-bold text-xl">
              F
            </div>
            <h1 className="text-2xl font-bold text-gray-900">FitTracker Pro</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="streak-badge">
              <Icon name="Flame" size={16} />
              <span>{user.streak} дней</span>
            </div>
            <div className="text-2xl">{mascots[mascotMood as keyof typeof mascots]}</div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="workout" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="workout">Тренировки</TabsTrigger>
            <TabsTrigger value="calories">Калории</TabsTrigger>
            <TabsTrigger value="leaderboard">Лидеры</TabsTrigger>
            <TabsTrigger value="profile">Профиль</TabsTrigger>
            <TabsTrigger value="support">Поддержка</TabsTrigger>
          </TabsList>

          {/* Тренировки */}
          <TabsContent value="workout" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Персональная программа */}
              <Card className="workout-card">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Icon name="Dumbbell" size={24} className="text-energetic-orange" />
                    Персональная программа
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Цель тренировок</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'mass', label: 'Масса', icon: 'TrendingUp' },
                          { value: 'loss', label: 'Похудение', icon: 'TrendingDown' },
                          { value: 'cardio', label: 'Кардио', icon: 'Heart' }
                        ].map(option => (
                          <Button
                            key={option.value}
                            variant={goal === option.value ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setGoal(option.value)}
                            className="flex items-center gap-2"
                          >
                            <Icon name={option.icon as any} size={16} />
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Тренировок в неделю</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {['2', '3', '4', '5'].map(freq => (
                          <Button
                            key={freq}
                            variant={frequency === freq ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFrequency(freq)}
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
              <Card className="workout-card">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Icon name="Target" size={24} className="text-athletic-blue" />
                    {workoutPlans[goal].name}
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" size={16} />
                        {workoutPlans[goal].duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Flame" size={16} />
                        ~{workoutPlans[goal].calories} ккал
                      </span>
                    </div>
                    
                    <ul className="space-y-2">
                      {workoutPlans[goal].exercises.map((exercise, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-energetic-orange rounded-full"></div>
                          {exercise}
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      onClick={checkInWorkout} 
                      className="w-full bg-energetic-orange hover:bg-energetic-orange/90 animate-pulse"
                      size="lg"
                    >
                      <Icon name="Check" size={20} />
                      Отметиться на тренировке
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Прогресс */}
            <Card className="workout-card">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Недельный прогресс</h3>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 7 }, (_, i) => (
                    <div key={i} className="text-center space-y-2">
                      <div className="text-xs text-muted-foreground">
                        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][i]}
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                        i < user.streak % 7 ? 'bg-energetic-orange text-white' : 'bg-muted'
                      }`}>
                        {i < user.streak % 7 ? '✓' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Калории */}
          <TabsContent value="calories" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="workout-card">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Icon name="Calculator" size={24} className="text-achievement-gold" />
                    Дневная норма
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-energetic-orange mb-1">
                        {dailyCalories.consumed}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        из {dailyCalories.target} ккал
                      </div>
                    </div>
                    
                    <Progress value={calorieProgress} className="h-3" />
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Белки</div>
                        <div className="font-semibold text-athletic-blue">120г</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Жиры</div>
                        <div className="font-semibold text-achievement-gold">65г</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Углеводы</div>
                        <div className="font-semibold text-energetic-orange">200г</div>
                      </div>
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
                    <Button className="w-full">
                      <Icon name="Plus" size={16} />
                      Добавить
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Лидеры */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card className="workout-card">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Icon name="Trophy" size={24} className="text-achievement-gold" />
                  Таблица лидеров
                </h2>
                
                <div className="space-y-3">
                  {leaderboard.map((leader, idx) => (
                    <div key={leader.name} className={`flex items-center justify-between p-3 rounded-lg ${
                      leader.name === user.name ? 'bg-energetic-orange/10 border border-energetic-orange/20' : 'bg-muted/50'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          idx === 0 ? 'bg-achievement-gold' : 
                          idx === 1 ? 'bg-gray-400' : 
                          idx === 2 ? 'bg-orange-600' : 'bg-athletic-blue'
                        }`}>
                          {idx < 3 ? ['🥇', '🥈', '🥉'][idx] : idx + 1}
                        </div>
                        <div>
                          <div className="font-medium">{leader.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {leader.workouts} тренировок
                          </div>
                        </div>
                      </div>
                      <div className="streak-badge">
                        <Icon name="Flame" size={14} />
                        {leader.streak}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Профиль */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="workout-card">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Icon name="User" size={24} className="text-fitness-purple" />
                  Мой профиль
                </h2>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Имя</Label>
                      <Input value={user.name} readOnly />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input placeholder="your.email@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Возраст</Label>
                      <Input placeholder="25" type="number" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <div className="text-2xl mb-2">{mascots[mascotMood as keyof typeof mascots]}</div>
                      <div className="font-medium mb-1">Твой спутник</div>
                      <div className="text-sm text-muted-foreground">
                        Орел-мотиватор всегда рядом!
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="text-xl font-bold text-energetic-orange">{user.streak}</div>
                        <div className="text-xs text-muted-foreground">Дней подряд</div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="text-xl font-bold text-athletic-blue">{user.workouts}</div>
                        <div className="text-xs text-muted-foreground">Тренировок</div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="text-xl font-bold text-achievement-gold">
                          {Math.floor(user.workouts / 5)}
                        </div>
                        <div className="text-xs text-muted-foreground">Уровень</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Поддержка */}
          <TabsContent value="support" className="space-y-6">
            <Card className="workout-card">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Icon name="Heart" size={24} className="text-red-500" />
                  Поддержать проект
                </h2>
                
                <p className="text-muted-foreground">
                  FitTracker Pro разрабатывается энтузиастами. Ваша поддержка поможет нам добавить новые функции и улучшить приложение!
                </p>
                
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { amount: '100₽', desc: 'Кофе разработчику' },
                    { amount: '500₽', desc: 'Обед команды' },
                    { amount: '1000₽', desc: 'Премиум функции' }
                  ].map(option => (
                    <Button key={option.amount} variant="outline" className="h-auto p-4 flex-col gap-2">
                      <div className="text-lg font-bold text-energetic-orange">{option.amount}</div>
                      <div className="text-sm text-muted-foreground text-center">{option.desc}</div>
                    </Button>
                  ))}
                </div>
                
                <div className="text-center text-sm text-muted-foreground">
                  <Icon name="Shield" size={16} className="inline mr-1" />
                  Безопасная оплата через Stripe
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;