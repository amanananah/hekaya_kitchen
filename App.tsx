import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from './src/components/BottomNav';
import { CaptureScreen } from './src/screens/CaptureScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LessonScreen } from './src/screens/LessonScreen';
import { PlaceholderScreen } from './src/screens/PlaceholderScreen';
import { RecipeScreen } from './src/screens/RecipeScreen';
import { RecipesScreen } from './src/screens/RecipesScreen';
import { featuredRecipe, recipes } from './src/data';
import { colors } from './src/theme';
import type { AppScreen, CapturePhase } from './src/types';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [capturePhase, setCapturePhase] = useState<CapturePhase>('intro');
  const [selectedRecipeId, setSelectedRecipeId] = useState(featuredRecipe.id);
  const [recipeReturnScreen, setRecipeReturnScreen] = useState<'home' | 'recipes'>('home');
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

  function openRecipe(recipeId: string, returnTo: 'home' | 'recipes') {
    setSelectedRecipeId(recipeId);
    setRecipeReturnScreen(returnTo);
    setScreen('recipe');
  }

  function startLesson(recipeId: string, step = 1) {
    setSelectedRecipeId(recipeId);
    setLessonStep(step);
    setScreen('lesson');
  }

  function handleRecordingComplete() {
    setCapturePhase('analysis');
    analysisTimer.current = setTimeout(() => setCapturePhase('result'), 1900);
  }

  const selectedRecipe = recipes.find((recipe) => recipe.id === selectedRecipeId) ?? featuredRecipe;

  const showBottomNav = ['home', 'recipes', 'capture', 'family'].includes(screen) && !(screen === 'capture' && capturePhase !== 'intro');

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style={screen === 'capture' && capturePhase === 'camera' ? 'light' : 'dark'} />
        <View style={styles.app}>
        {screen === 'home' ? (
          <HomeScreen
            onCapture={() => navigate('capture')}
            onLearn={(recipeId) => startLesson(recipeId, 3)}
            onOpenRecipe={(recipeId) => openRecipe(recipeId, 'home')}
            onRecipes={() => setScreen('recipes')}
          />
        ) : null}
        {screen === 'recipes' ? <RecipesScreen onOpenRecipe={(recipeId) => openRecipe(recipeId, 'recipes')} /> : null}
        {screen === 'family' ? <PlaceholderScreen kind="family" /> : null}
        {screen === 'capture' ? (
          <CaptureScreen
            onBack={() => setScreen('home')}
            onBegin={() => setCapturePhase('camera')}
            onRecorded={handleRecordingComplete}
            onRetake={() => setCapturePhase('intro')}
            onSave={() => openRecipe(featuredRecipe.id, 'home')}
            phase={capturePhase}
          />
        ) : null}
        {screen === 'recipe' ? (
          <RecipeScreen
            onBack={() => setScreen(recipeReturnScreen)}
            onLearn={() => startLesson(selectedRecipe.id)}
            recipe={selectedRecipe}
          />
        ) : null}
        {screen === 'lesson' ? (
          <LessonScreen
            onBack={() => setScreen('recipe')}
            onFinish={() => setScreen('home')}
            onNext={() => setLessonStep((value) => value + 1)}
            recipe={selectedRecipe}
            step={lessonStep}
          />
        ) : null}
          {showBottomNav ? <BottomNav active={screen} onNavigate={navigate} /> : null}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
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
