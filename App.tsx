import { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { BottomNav } from './src/components/BottomNav';
import { CaptureScreen } from './src/screens/CaptureScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LessonScreen } from './src/screens/LessonScreen';
import { PlaceholderScreen } from './src/screens/PlaceholderScreen';
import { RecipeScreen } from './src/screens/RecipeScreen';
import { colors } from './src/theme';
import type { AppScreen, CapturePhase } from './src/types';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [capturePhase, setCapturePhase] = useState<CapturePhase>('intro');
  const [lessonStep, setLessonStep] = useState(3);
  const analysisTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (analysisTimer.current) clearTimeout(analysisTimer.current);
    };
  }, []);

  function navigate(next: AppScreen) {
    setScreen(next);
    if (next === 'capture') setCapturePhase('intro');
  }

  function startLesson() {
    setLessonStep(3);
    setScreen('lesson');
  }

  function handleRecordingComplete() {
    setCapturePhase('analysis');
    analysisTimer.current = setTimeout(() => setCapturePhase('result'), 1900);
  }

  const showBottomNav = ['home', 'recipes', 'capture', 'family'].includes(screen) && !(screen === 'capture' && capturePhase !== 'intro');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={screen === 'capture' && capturePhase === 'camera' ? 'light' : 'dark'} />
      <View style={styles.app}>
        {screen === 'home' ? (
          <HomeScreen
            onCapture={() => navigate('capture')}
            onLearn={startLesson}
            onOpenRecipe={() => setScreen('recipe')}
            onRecipes={() => setScreen('recipes')}
          />
        ) : null}
        {screen === 'recipes' ? <PlaceholderScreen kind="recipes" /> : null}
        {screen === 'family' ? <PlaceholderScreen kind="family" /> : null}
        {screen === 'capture' ? (
          <CaptureScreen
            onBack={() => setScreen('home')}
            onBegin={() => setCapturePhase('camera')}
            onRecorded={handleRecordingComplete}
            onRetake={() => setCapturePhase('intro')}
            onSave={() => setScreen('recipe')}
            phase={capturePhase}
          />
        ) : null}
        {screen === 'recipe' ? <RecipeScreen onBack={() => setScreen('home')} onLearn={startLesson} /> : null}
        {screen === 'lesson' ? (
          <LessonScreen
            onBack={() => setScreen('recipe')}
            onFinish={() => setScreen('home')}
            onNext={() => setLessonStep((value) => value + 1)}
            step={lessonStep}
          />
        ) : null}
        {showBottomNav ? <BottomNav active={screen} onNavigate={navigate} /> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  app: {
    flex: 1,
    backgroundColor: colors.cream,
  },
});
