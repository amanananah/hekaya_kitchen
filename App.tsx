import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from './src/components/BottomNav';
import { CaptureScreen } from './src/screens/CaptureScreen';
import { AttemptScreen } from './src/screens/AttemptScreen';
import { FamilyScreen } from './src/screens/FamilyScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ElderHomeScreen } from './src/screens/ElderHomeScreen';
import { ElderReplyScreen } from './src/screens/ElderReplyScreen';
import { LessonScreen } from './src/screens/LessonScreen';
import { RecipeScreen } from './src/screens/RecipeScreen';
import { RecipesScreen } from './src/screens/RecipesScreen';
import { TogetherScreen } from './src/screens/TogetherScreen';
import { featuredRecipe, recipes } from './src/data';
import { colors } from './src/theme';
import type { AppScreen, CapturePhase } from './src/types';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [capturePhase, setCapturePhase] = useState<CapturePhase>('intro');
  const [captureReturnScreen, setCaptureReturnScreen] = useState<'home' | 'elder'>('home');
  const [elderArabic, setElderArabic] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState(featuredRecipe.id);
  const [recipeReturnScreen, setRecipeReturnScreen] = useState<'home' | 'recipes'>('home');
  const [lessonStep, setLessonStep] = useState(3);
  const [hasAttempt, setHasAttempt] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [togetherMode, setTogetherMode] = useState(false);
  const [togetherReturnScreen, setTogetherReturnScreen] = useState<'home' | 'family'>('home');
  const [verifiedRecipeIds, setVerifiedRecipeIds] = useState(() => new Set(recipes.filter((recipe) => recipe.detailsToConfirm === 0).map((recipe) => recipe.id)));
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

  function openCapture(returnTo: 'home' | 'elder', phase: CapturePhase = 'intro') {
    setCaptureReturnScreen(returnTo);
    setCapturePhase(phase);
    setScreen('capture');
  }

  function startLesson(recipeId: string, step = 1, isTogether = false) {
    setSelectedRecipeId(recipeId);
    setLessonStep(step);
    setTogetherMode(isTogether);
    setScreen('lesson');
  }

  function openTogether(returnTo: 'home' | 'family') {
    setSelectedRecipeId(featuredRecipe.id);
    setTogetherReturnScreen(returnTo);
    setScreen('together');
  }

  function handleRecordingComplete() {
    setCapturePhase('analysis');
    analysisTimer.current = setTimeout(() => setCapturePhase('result'), 1900);
  }

  const displayRecipes = recipes.map((recipe) => verifiedRecipeIds.has(recipe.id)
    ? { ...recipe, confirmedSteps: recipe.lesson.steps.length, detailsToConfirm: 0 }
    : recipe);
  const selectedRecipe = displayRecipes.find((recipe) => recipe.id === selectedRecipeId) ?? featuredRecipe;
  const displayedFeaturedRecipe = displayRecipes.find((recipe) => recipe.id === featuredRecipe.id) ?? featuredRecipe;

  const showBottomNav = ['home', 'recipes', 'capture', 'family'].includes(screen) && !(screen === 'capture' && capturePhase !== 'intro');

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style={screen === 'capture' && capturePhase === 'camera' ? 'light' : 'dark'} />
        <View style={styles.app}>
        {screen === 'home' ? (
          <HomeScreen
            featuredRecipe={displayedFeaturedRecipe}
            onCapture={() => openCapture('home')}
            onElderMode={() => setScreen('elder')}
            onLearn={(recipeId) => startLesson(recipeId, 3)}
            onOpenRecipe={(recipeId) => openRecipe(recipeId, 'home')}
            onRecipes={() => setScreen('recipes')}
            onTogether={() => openTogether('home')}
          />
        ) : null}
        {screen === 'elder' ? (
          <ElderHomeScreen
            arabic={elderArabic}
            hasReply={Boolean(feedback)}
            onExit={() => setScreen('home')}
            onLanguageChange={setElderArabic}
            onRecord={() => openCapture('elder')}
            onReply={() => {
              setHasAttempt(true);
              setScreen('elderReply');
            }}
            onReview={() => openCapture('elder', 'result')}
          />
        ) : null}
        {screen === 'elderReply' ? (
          <ElderReplyScreen
            arabic={elderArabic}
            onBack={() => setScreen('elder')}
            onSend={(message) => {
              setFeedback(message);
              setScreen('elder');
            }}
            recipe={selectedRecipe}
          />
        ) : null}
        {screen === 'recipes' ? <RecipesScreen onOpenRecipe={(recipeId) => openRecipe(recipeId, 'recipes')} recipes={displayRecipes} /> : null}
        {screen === 'family' ? <FamilyScreen feedback={feedback} hasAttempt={hasAttempt} onFeedback={setFeedback} onTogether={() => openTogether('family')} recipe={selectedRecipe} /> : null}
        {screen === 'capture' ? (
          <CaptureScreen
            elderArabic={captureReturnScreen === 'elder' && elderArabic}
            onBack={() => setScreen(captureReturnScreen)}
            onBegin={() => setCapturePhase('camera')}
            onRecorded={handleRecordingComplete}
            onRetake={() => setCapturePhase('intro')}
            onSave={() => {
              setVerifiedRecipeIds((current) => new Set(current).add(featuredRecipe.id));
              if (captureReturnScreen === 'elder') setScreen('elder');
              else openRecipe(featuredRecipe.id, 'home');
            }}
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
            onBack={() => setScreen(togetherMode ? 'together' : 'recipe')}
            onFinish={() => setScreen('attempt')}
            onNext={() => setLessonStep((value) => value + 1)}
            recipe={selectedRecipe}
            step={lessonStep}
            togetherMode={togetherMode}
          />
        ) : null}
        {screen === 'together' ? (
          <TogetherScreen
            onBack={() => setScreen(togetherReturnScreen)}
            onStart={() => startLesson(selectedRecipe.id, 1, true)}
            recipe={selectedRecipe}
          />
        ) : null}
        {screen === 'attempt' ? (
          <AttemptScreen
            onBack={() => setScreen('lesson')}
            onSubmit={() => {
              setHasAttempt(true);
              setFeedback(null);
              setScreen('family');
            }}
            recipe={selectedRecipe}
            togetherMode={togetherMode}
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
