import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BrandMark } from '../components/BrandMark';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { SubscreenHeader } from '../components/SubscreenHeader';
import { colors, radii } from '../theme';
import type { CapturePhase, Recipe, RecipeStep } from '../types';

type CaptureScreenProps = {
  elderArabic?: boolean;
  phase: CapturePhase;
  onBack: () => void;
  onBegin: () => void;
  onRecorded: (uri?: string) => void;
  onRetake: () => void;
  onSave: () => void;
  onUseRecording: () => void;
  recordingUri: string | null;
  recipe: Recipe;
};

export function CaptureScreen(props: CaptureScreenProps) {
  if (props.phase === 'camera') {
    if (Platform.OS === 'web') return <WebCamera onBack={props.onRetake} onRecorded={props.onRecorded} recipe={props.recipe} />;
    return <NativeCamera onBack={props.onRetake} onRecorded={props.onRecorded} recipe={props.recipe} />;
  }
  if (props.phase === 'preview' && props.recordingUri) return <RecordingPreview onRetake={props.onRetake} onUseRecording={props.onUseRecording} recipe={props.recipe} uri={props.recordingUri} />;
  if (props.phase === 'analysis') return <AnalysisScreen recipe={props.recipe} />;
  if (props.phase === 'result') return <ResultScreen arabic={props.elderArabic} onBack={props.onBack} onRetake={props.onRetake} onSave={props.onSave} recipe={props.recipe} recordingUri={props.recordingUri} />;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} style={styles.screen}>
      <SubscreenHeader title="Capture a recipe" subtitle="The family cook can simply cook as usual" onBack={props.onBack} />
      <Text style={styles.title}>Record the family cook</Text>
      <Text style={styles.body}>
        They can speak naturally in Arabic or English. You will review the recipe together afterwards.
      </Text>

      {props.recipe.id === 'peanut-butter-sandwich' ? (
        <View style={styles.practiceCard}>
          <Text style={styles.practiceLabel}>QUICK PRACTICE · ABOUT 2 MINUTES</Text>
          <Text style={styles.practiceTitle}>Peanut Butter Sandwich</Text>
          <Text style={styles.practiceCopy}>You only need two bread slices, peanut butter, a spoon, and a plate.</Text>
        </View>
      ) : null}

      <View style={styles.introArt}>
        <View style={styles.introOrbit} />
        <View style={styles.phone}>
          <View style={styles.phoneLens}><View style={styles.phoneDot} /></View>
        </View>
      </View>

      <View style={styles.tipList}>
        <Tip number="1" text="Keep the ingredients and bowl in view." />
        <Tip number="2" text="Speak naturally—no script is needed." />
        <Tip number="3" text="You can correct every step before saving." />
      </View>
      <PrimaryButton onPress={props.onBegin}>Open camera</PrimaryButton>
    </ScrollView>
  );
}

function NativeCamera({ onBack, onRecorded, recipe }: { onBack: () => void; onRecorded: (uri?: string) => void; recipe: Recipe }) {
  const cameraRef = useRef<CameraView | null>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const [ready, setReady] = useState(false);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const discardRecording = useRef(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (recording) interval = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => { if (interval) clearInterval(interval); };
  }, [recording]);

  useEffect(() => {
    async function ensurePermissions() {
      if (!cameraPermission?.granted) await requestCameraPermission();
      if (!microphonePermission?.granted) await requestMicrophonePermission();
    }
    void ensurePermissions();
  }, [cameraPermission?.granted, microphonePermission?.granted, requestCameraPermission, requestMicrophonePermission]);

  async function startRecording() {
    if (!cameraRef.current || !ready || recording) return;
    setElapsed(0);
    discardRecording.current = false;
    setRecording(true);
    try {
      const result = await cameraRef.current.recordAsync({ maxDuration: 300 });
      setRecording(false);
      if (discardRecording.current) return;
      if (!result?.uri) throw new Error('Recording URI was not returned');
      onRecorded(result.uri);
    } catch {
      Alert.alert('Recording stopped', 'Hekaya Kitchen could not keep this recording. Please try again.');
      setRecording(false);
    }
  }

  function stopRecording() {
    if (!recording) return;
    cameraRef.current?.stopRecording();
    setRecording(false);
  }

  function cancelRecording() {
    discardRecording.current = true;
    if (recording) cameraRef.current?.stopRecording();
    onBack();
  }

  if (!cameraPermission || !microphonePermission) {
    return <View style={styles.permission}><Text style={styles.permissionCopy}>Preparing the camera…</Text></View>;
  }

  if (!cameraPermission.granted || !microphonePermission.granted) {
    return (
      <View style={styles.permission}>
        <BrandMark size={64} />
        <Text style={styles.permissionTitle}>Camera and microphone access</Text>
        <Text style={styles.permissionCopy}>
          Hekaya Kitchen needs both to save the cooking demonstration and the cook's original voice.
        </Text>
        <PrimaryButton
          onPress={() => {
            void requestCameraPermission();
            void requestMicrophonePermission();
          }}
          style={styles.permissionButton}
        >
          Allow access
        </PrimaryButton>
        <SecondaryButton onPress={onBack} style={styles.permissionButton}>Not now</SecondaryButton>
      </View>
    );
  }

  return (
    <View style={styles.cameraScreen}>
      <CameraView
        facing="back"
        mode="video"
        mute={false}
        onCameraReady={() => setReady(true)}
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.cameraShade} />
      <View style={styles.cameraTop}>
        <Pressable accessibilityLabel="Cancel recording" onPress={cancelRecording} style={styles.cameraBack}>
          <Text style={styles.cameraBackText}>×</Text>
        </Pressable>
        <View style={styles.liveBadge}>
          <View style={[styles.liveDot, !recording && styles.liveDotIdle]} />
          <Text style={styles.liveText}>{recording ? `Recording ${recipe.name}` : `Ready for ${recipe.name}`}</Text>
        </View>
        <Text style={styles.timer}>{formatDuration(elapsed)}</Text>
      </View>
      <View style={styles.focusFrame} />
      <View style={styles.demoCue}>
        <Text style={styles.demoCueTitle}>{recipe.name.toLocaleUpperCase()} DEMO</Text>
        <Text style={styles.demoCueText}>{recipe.id === 'peanut-butter-sandwich' ? 'Show the ingredients, spreading, closing, and finished sandwich.' : 'Keep each important cooking action clearly in view.'}</Text>
      </View>
      {recording ? <View style={styles.detectedRow}><DetectedChip text="Original voice is being preserved" /></View> : null}
      <View style={styles.cameraBottom}>
        <Text style={styles.cameraHint}>
          {recording ? 'Speak naturally—Arabic and English are both welcome.' : 'Frame your demonstration, then tap record.'}
        </Text>
        <Pressable
          accessibilityLabel={recording ? 'Stop recording' : 'Start recording'}
          disabled={!ready}
          onPress={recording ? stopRecording : () => void startRecording()}
          style={[styles.recordOuter, !ready && styles.disabled]}
        >
          <View style={recording ? styles.stopInner : styles.recordInner} />
        </Pressable>
      </View>
    </View>
  );
}

// expo-camera does not support video recording on web, so we use the browser's
// MediaRecorder API directly. The preview and recording UI match the native flow.
function WebCamera({ onBack, onRecorded, recipe }: { onBack: () => void; onRecorded: (uri?: string) => void; recipe: Recipe }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const discardRef = useRef(false);
  const [status, setStatus] = useState<'starting' | 'denied' | 'ready'>('starting');
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (recording) interval = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => { if (interval) clearInterval(interval); };
  }, [recording]);

  async function startStream() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('denied');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        void videoRef.current.play().catch(() => {});
      }
      setStatus('ready');
    } catch {
      setStatus('denied');
    }
  }

  useEffect(() => {
    void startStream();
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  function startRecording() {
    const stream = streamRef.current;
    if (!stream || recording || status !== 'ready') return;
    setElapsed(0);
    discardRef.current = false;
    chunksRef.current = [];
    const mimeTypes = ['video/mp4', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
    const mimeType = mimeTypes.find((type) => MediaRecorder.isTypeSupported(type));
    const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    recorderRef.current = recorder;
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
      if (!discardRef.current && blob.size > 0) onRecorded(URL.createObjectURL(blob));
    };
    recorder.start();
    setRecording(true);
  }

  function stopRecording() {
    if (!recording) return;
    setRecording(false);
    recorderRef.current?.stop();
  }

  function cancelRecording() {
    discardRef.current = true;
    if (recording) recorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    onBack();
  }

  if (status === 'starting') {
    return <View style={styles.permission}><Text style={styles.permissionCopy}>Preparing the camera…</Text></View>;
  }

  if (status === 'denied') {
    return (
      <View style={styles.permission}>
        <BrandMark size={64} />
        <Text style={styles.permissionTitle}>Camera and microphone access</Text>
        <Text style={styles.permissionCopy}>
          Hekaya Kitchen needs both to save the cooking demonstration and the cook's original voice.
        </Text>
        <PrimaryButton
          onPress={() => {
            setStatus('starting');
            void startStream();
          }}
          style={styles.permissionButton}
        >
          Allow access
        </PrimaryButton>
        <SecondaryButton onPress={onBack} style={styles.permissionButton}>Not now</SecondaryButton>
      </View>
    );
  }

  return (
    <View style={styles.cameraScreen}>
      {React.createElement('video', {
        autoPlay: true,
        muted: true,
        playsInline: true,
        ref: videoRef,
        style: styles.webVideo,
      })}
      <View style={styles.cameraShade} />
      <View style={styles.cameraTop}>
        <Pressable accessibilityLabel="Cancel recording" onPress={cancelRecording} style={styles.cameraBack}>
          <Text style={styles.cameraBackText}>×</Text>
        </Pressable>
        <View style={styles.liveBadge}>
          <View style={[styles.liveDot, !recording && styles.liveDotIdle]} />
          <Text style={styles.liveText}>{recording ? `Recording ${recipe.name}` : `Ready for ${recipe.name}`}</Text>
        </View>
        <Text style={styles.timer}>{formatDuration(elapsed)}</Text>
      </View>
      <View style={styles.focusFrame} />
      <View style={styles.demoCue}>
        <Text style={styles.demoCueTitle}>{recipe.name.toLocaleUpperCase()} DEMO</Text>
        <Text style={styles.demoCueText}>{recipe.id === 'peanut-butter-sandwich' ? 'Show the ingredients, spreading, closing, and finished sandwich.' : 'Keep each important cooking action clearly in view.'}</Text>
      </View>
      {recording ? <View style={styles.detectedRow}><DetectedChip text="Original voice is being preserved" /></View> : null}
      <View style={styles.cameraBottom}>
        <Text style={styles.cameraHint}>
          {recording ? 'Speak naturally—Arabic and English are both welcome.' : 'Frame your demonstration, then tap record.'}
        </Text>
        <Pressable
          accessibilityLabel={recording ? 'Stop recording' : 'Start recording'}
          onPress={recording ? stopRecording : startRecording}
          style={[styles.recordOuter, status !== 'ready' && styles.disabled]}
        >
          <View style={recording ? styles.stopInner : styles.recordInner} />
        </Pressable>
      </View>
    </View>
  );
}

function RecordingPreview({ onRetake, onUseRecording, recipe, uri }: { onRetake: () => void; onUseRecording: () => void; recipe: Recipe; uri: string }) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent} style={styles.screen}>
      <SubscreenHeader title="Check your recording" subtitle={`${recipe.name} demonstration`} onBack={onRetake} />
      <Text style={styles.previewTitle}>Your real video is ready</Text>
      <Text style={styles.previewCopy}>Play it now and check that the cooking and voice are clear.</Text>
      <RecordedVideo uri={uri} />
      <View style={styles.recordingProof}>
        <Text style={styles.recordingProofIcon}>✓</Text>
        <View style={styles.flexOne}>
          <Text style={styles.recordingProofTitle}>Original recording preserved</Text>
          <Text style={styles.recordingProofCopy}>This exact video will stay attached to the lesson during this demo.</Text>
        </View>
      </View>
      <PrimaryButton onPress={onUseRecording}>Use this recording</PrimaryButton>
      <SecondaryButton onPress={onRetake} style={styles.previewRetake}>Record again</SecondaryButton>
    </ScrollView>
  );
}

function RecordedVideo({ compact = false, uri }: { compact?: boolean; uri: string }) {
  const player = useVideoPlayer(uri, (videoPlayer) => {
    videoPlayer.loop = false;
  });

  return (
    <View style={[styles.videoFrame, compact && styles.videoFrameCompact]}>
      <VideoView allowsFullscreen contentFit="cover" nativeControls player={player} playsInline style={StyleSheet.absoluteFill} />
      <View pointerEvents="none" style={styles.realBadge}><Text style={styles.realBadgeText}>ORIGINAL RECORDING</Text></View>
    </View>
  );
}

function AnalysisScreen({ recipe }: { recipe: Recipe }) {
  return (
    <View style={styles.analysisScreen}>
      <View style={styles.analysisOrbit}>
        <View style={styles.analysisDashed} />
        <BrandMark size={72} />
      </View>
      <Text style={styles.analysisTitle}>Preparing your recipe</Text>
      <Text style={styles.analysisCopy}>
        Organising your {recipe.name} recording into clear cooking steps.
      </Text>
      <View style={styles.analysisList}>
        <AnalysisRow complete text="Arabic and English transcript created" />
        <AnalysisRow complete text="Original voice preserved" />
        <AnalysisRow text="Checking details to review…" />
      </View>
    </View>
  );
}

function ResultScreen({ arabic = false, onBack, onRetake, onSave, recipe, recordingUri }: { arabic?: boolean; onBack: () => void; onRetake: () => void; onSave: () => void; recipe: Recipe; recordingUri: string | null }) {
  const [reviewIndex, setReviewIndex] = useState(0);
  const [voiceEditing, setVoiceEditing] = useState(false);
  const [corrected, setCorrected] = useState(() => new Set<string>());
  const [skipped, setSkipped] = useState(() => new Set<string>());
  const extractedSteps: RecipeStep[] = recipe.lesson.steps.map((lessonStep, index) => ({
    index: `Step ${index + 1}`,
    title: lessonStep.title,
    detail: lessonStep.checkpoint,
    insight: index === 2 || index === 4 ? 'Needs confirmation' : index === 1 ? `${recipe.keeper}'s phrase` : 'Visual checkpoint',
  }));
  const corrections: Record<string, string> = recipe.id === 'peanut-butter-sandwich' ? {
    'Step 3': 'Spread slowly until the peanut butter reaches close to all four edges.',
    'Step 5': 'Place the sandwich on the plate and hold it still for the final view.',
  } : {
    'Step 3': 'Keep it covered until the dough is rounded and tiny bubbles cover the surface.',
    'Step 5': 'Turn gently more than once so every side reaches an even deep gold.',
  };
  const complete = reviewIndex >= extractedSteps.length;
  const step = extractedSteps[Math.min(reviewIndex, extractedSteps.length - 1)]!;
  const arabicSteps: Record<string, { title: string; detail: string }> = {
    'Step 1': { title: 'اخلطي العجين', detail: 'اخلطي الدقيق والخميرة والزعفران والماء الدافئ باليد.' },
    'Step 2': { title: 'افحصي القوام', detail: 'يجب أن يكون العجين طرياً ويسقط من اليد كشريط سميك.' },
    'Step 3': { title: 'اتركيه يتخمر', detail: 'غطي العجين حتى يمتلئ سطحه بالفقاعات الصغيرة.' },
    'Step 4': { title: 'شكّلي اللقيمات', detail: 'بللي يدك وخذي قطعاً صغيرة متساوية.' },
    'Step 5': { title: 'اقلِي حتى يصبح ذهبياً', detail: 'قلّبي اللقيمات برفق حتى يصبح لونها ذهبياً من كل الجهات.' },
  };
  const arabicPracticeSteps: Record<string, { title: string; detail: string }> = {
    'Step 1': { title: 'حضّري المكونات', detail: 'ضعي شريحتي خبز وزبدة الفول السوداني وملعقة وطبقاً أمام الكاميرا.' },
    'Step 2': { title: 'أضيفي زبدة الفول السوداني', detail: 'ضعي ملعقة واحدة في وسط شريحة الخبز.' },
    'Step 3': { title: 'افرديها حتى الزوايا', detail: 'حرّكي الملعقة ببطء حتى تصل زبدة الفول السوداني إلى جميع الحواف.' },
    'Step 4': { title: 'أغلقي الساندويتش', detail: 'ضعي الشريحة الثانية فوق الأولى وحاذي الزوايا الأربع.' },
    'Step 5': { title: 'اعرضي النتيجة', detail: 'ضعي الساندويتش على الطبق وأظهري الجانبين للكاميرا.' },
  };
  const displayedStep = arabic ? (recipe.id === 'peanut-butter-sandwich' ? arabicPracticeSteps[step.index] : arabicSteps[step.index]) : undefined;

  function confirmStep(useVoiceCorrection = false) {
    if (useVoiceCorrection) setCorrected((current) => new Set(current).add(step.index));
    setSkipped((current) => {
      const next = new Set(current);
      next.delete(step.index);
      return next;
    });
    setVoiceEditing(false);
    setReviewIndex((current) => current + 1);
  }

  function skipStep() {
    setSkipped((current) => new Set(current).add(step.index));
    setReviewIndex((current) => current + 1);
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} style={styles.screen}>
      <SubscreenHeader title={arabic ? 'مراجعة الوصفة' : 'Review recipe'} subtitle={complete ? (arabic ? 'جاهزة للحفظ' : 'Ready to save') : (arabic ? `السؤال ${reviewIndex + 1} من ${extractedSteps.length}` : `Question ${reviewIndex + 1} of ${extractedSteps.length}`)} onBack={onBack} />

      {complete ? (
        <View>
          <View style={styles.reviewCompleteIcon}><Text style={styles.reviewCompleteCheck}>✓</Text></View>
          <Text style={styles.reviewCompleteTitle}>{arabic ? (skipped.size ? `${skipped.size} تفاصيل ما زالت تحتاج للمراجعة` : 'تمت مراجعة الوصفة') : (skipped.size ? `${skipped.size} ${skipped.size === 1 ? 'detail' : 'details'} still need review` : 'The recipe has been reviewed')}</Text>
          <Text style={styles.reviewCompleteCopy}>{arabic ? `تم تأكيد ${extractedSteps.length - skipped.size} خطوات · تم تصحيح ${corrected.size} بالصوت` : `${extractedSteps.length - skipped.size} steps confirmed · ${corrected.size} corrected by voice`}</Text>
          {!skipped.size ? (
            <>
              <View style={styles.materialsCard}>
                <Text style={styles.materialsLabel}>{arabic ? 'المكونات' : 'INGREDIENTS'}</Text>
                <Text style={[styles.materialsText, arabic && styles.rtlText]}>{recipe.id === 'peanut-butter-sandwich' ? (arabic ? 'شريحتا خبز · زبدة الفول السوداني · ملعقة · طبق' : '2 bread slices · peanut butter · spoon · plate') : (arabic ? 'دقيق · خميرة · زعفران · ماء دافئ · دبس تمر' : 'Flour · yeast · saffron · warm water · date syrup')}</Text>
                <Text style={[styles.materialsNote, arabic && styles.rtlText]}>{recipe.id === 'peanut-butter-sandwich' ? (arabic ? 'تأكدوا من عدم وجود حساسية من الفول السوداني قبل التقديم.' : 'Check for peanut allergies before serving.') : (arabic ? 'لم نخمن الكميات. يمكن إضافتها لاحقاً.' : 'No amounts were guessed. They can be added later.')}</Text>
              </View>
              <View style={styles.languageCard}>
                <Text style={[styles.languageTitle, arabic && styles.rtlText]}>{arabic ? 'الكلام العربي الأصلي والترجمة الإنجليزية جاهزان' : 'Arabic original and English translation ready'}</Text>
                <Text style={[styles.languageCopy, arabic && styles.rtlText]}>{arabic ? 'سيبقى التسجيل الأصلي مع الوصفة.' : 'The original recording will stay with the recipe.'}</Text>
              </View>
              <PrimaryButton onPress={onSave}>{arabic ? 'حفظ وصفة العائلة' : 'Save family recipe'}</PrimaryButton>
            </>
          ) : (
            <PrimaryButton onPress={() => { setReviewIndex(0); setSkipped(new Set()); }}>{arabic ? 'مراجعة التفاصيل المتبقية' : 'Review remaining details'}</PrimaryButton>
          )}
          <SecondaryButton onPress={() => { setReviewIndex(0); setSkipped(new Set()); }} style={styles.reviewAgain}>{arabic ? 'بدء المراجعة من جديد' : 'Start review again'}</SecondaryButton>
        </View>
      ) : (
        <View>
          <View style={styles.reviewProgress}>
            {extractedSteps.map((item, index) => <View key={item.index} style={[styles.reviewProgressPart, index <= reviewIndex && styles.reviewProgressActive]} />)}
          </View>
          {recordingUri ? <RecordedVideo compact uri={recordingUri} /> : null}
          <Pressable accessibilityRole="button" style={styles.originalClip}>
            <View style={styles.clipPlay}><Text style={styles.clipPlayText}>▶</Text></View>
            <View style={styles.flexOne}>
              <Text style={[styles.clipTitle, arabic && styles.rtlText]}>{arabic ? 'شغّلي كلامك الأصلي' : "Play the cook's original words"}</Text>
              <Text style={[styles.clipCopy, arabic && styles.rtlText]}>{arabic ? 'العربية · ١٢ ثانية' : 'Arabic · 12 seconds'}</Text>
            </View>
          </Pressable>

          <View style={styles.reviewCard}>
            <Text style={styles.reviewStep}>{arabic ? `الخطوة ${reviewIndex + 1}` : step.index}</Text>
            <Text style={[styles.reviewTitle, arabic && styles.rtlText]}>{displayedStep?.title ?? step.title}</Text>
            <Text style={[styles.reviewDetail, arabic && styles.rtlText]}>{displayedStep?.detail ?? (corrected.has(step.index) && corrections[step.index] ? corrections[step.index] : step.detail)}</Text>
            {step.insight === 'Needs confirmation' ? <Text style={styles.needsHelp}>{arabic ? 'يرجى التأكد من هذه المعلومة' : 'Please check this detail'}</Text> : null}
          </View>

          <Text style={styles.reviewQuestion}>{voiceEditing ? (arabic ? 'قولي التصحيح بصوتك' : 'Say the correction aloud') : (arabic ? 'هل هذا صحيح؟' : 'Is this correct?')}</Text>
          {voiceEditing ? (
            <View style={styles.listeningCard}>
              <View style={styles.listeningDot} />
              <Text style={styles.listeningText}>{arabic ? 'جاهز لتسجيل تصحيحك' : 'Voice correction ready to record'}</Text>
            </View>
          ) : null}
          <PrimaryButton onPress={() => voiceEditing ? confirmStep(true) : confirmStep()}>
            {voiceEditing ? (arabic ? 'حفظ التصحيح الصوتي' : 'Save voice correction') : (arabic ? 'نعم، صحيح' : 'Yes, correct')}
          </PrimaryButton>
          <SecondaryButton onPress={() => setVoiceEditing((value) => !value)} style={styles.voiceButton}>
            {voiceEditing ? (arabic ? 'إلغاء' : 'Cancel') : (arabic ? 'التصحيح بالصوت' : 'Change by voice')}
          </SecondaryButton>
          <Pressable onPress={skipStep} style={styles.reviewLater}>
            <Text style={styles.reviewLaterText}>{arabic ? 'اسألني لاحقاً' : 'Ask me later'}</Text>
          </Pressable>
          {reviewIndex === 0 ? <SecondaryButton onPress={onRetake} style={styles.retakeButton}>{arabic ? 'التسجيل مرة أخرى' : 'Record again'}</SecondaryButton> : null}
        </View>
      )}
    </ScrollView>
  );
}

function Tip({ number, text }: { number: string; text: string }) {
  return <View style={styles.tip}><View style={styles.tipNumber}><Text style={styles.tipNumberText}>{number}</Text></View><Text style={styles.tipText}>{text}</Text></View>;
}

function DetectedChip({ text }: { text: string }) {
  return <View style={styles.detectedChip}><Text style={styles.detectedText}>{text}</Text></View>;
}

function AnalysisRow({ complete = false, text }: { complete?: boolean; text: string }) {
  return <View style={styles.analysisRow}><View style={styles.analysisCheck}><Text style={styles.analysisCheckText}>{complete ? '✓' : '·'}</Text></View><Text style={[styles.analysisRowText, complete && styles.analysisRowComplete]}>{text}</Text></View>;
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remaining = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remaining}`;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  scrollContent: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 40 },
  eyebrow: { color: colors.clay, fontSize: 11, fontWeight: '800', letterSpacing: 1.6 },
  title: { marginTop: 10, color: colors.forestDeep, fontFamily: 'serif', fontSize: 37, lineHeight: 40, letterSpacing: -1.1 },
  body: { marginTop: 13, color: colors.inkMuted, fontSize: 14, lineHeight: 22 },
  practiceCard: { marginTop: 18, padding: 17, borderRadius: 20, backgroundColor: colors.clayPale },
  practiceLabel: { color: colors.clay, fontSize: 10, fontWeight: '800', letterSpacing: 1.1 },
  practiceTitle: { marginTop: 7, color: colors.forestDeep, fontSize: 19, fontWeight: '800' },
  practiceCopy: { marginTop: 5, color: colors.inkMuted, fontSize: 12, lineHeight: 18 },
  introArt: { height: 260, marginVertical: 24, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: radii.hero, backgroundColor: colors.sagePale },
  introOrbit: { position: 'absolute', width: 282, height: 282, borderWidth: 1, borderColor: colors.line, borderRadius: 141 },
  phone: { width: 120, height: 208, alignItems: 'center', justifyContent: 'center', borderWidth: 6, borderColor: colors.forest, borderRadius: 28, backgroundColor: colors.paper, transform: [{ rotate: '-5deg' }] },
  phoneLens: { width: 76, height: 76, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.forest, borderRadius: 38 },
  phoneDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.clay },
  tipList: { gap: 10, marginBottom: 22 },
  tip: { minHeight: 58, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 11, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, borderRadius: 17, backgroundColor: colors.paper },
  tipNumber: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: colors.clayPale },
  tipNumberText: { color: colors.clay, fontSize: 12, fontWeight: '800' },
  tipText: { flex: 1, color: colors.inkMuted, fontSize: 12, lineHeight: 17 },
  permission: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 34, backgroundColor: colors.cream },
  permissionTitle: { marginTop: 20, color: colors.forestDeep, fontFamily: 'serif', fontSize: 30, textAlign: 'center' },
  permissionCopy: { marginTop: 10, color: colors.inkMuted, fontSize: 14, lineHeight: 21, textAlign: 'center' },
  permissionButton: { alignSelf: 'stretch', marginTop: 14 },
  cameraScreen: { flex: 1, backgroundColor: colors.forestDeep },
  webVideo: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' },
  cameraShade: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(11,26,20,0.14)' },
  cameraTop: { position: 'absolute', left: 18, right: 18, top: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cameraBack: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 21, backgroundColor: 'rgba(12,25,20,0.56)' },
  cameraBackText: { marginTop: -3, color: colors.white, fontSize: 30, fontWeight: '300' },
  liveBadge: { paddingHorizontal: 11, paddingVertical: 9, flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: radii.round, backgroundColor: 'rgba(12,25,20,0.58)' },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger },
  liveDotIdle: { backgroundColor: colors.gold },
  liveText: { color: colors.white, fontSize: 11, fontWeight: '800' },
  timer: { minWidth: 45, color: colors.white, fontSize: 12, fontVariant: ['tabular-nums'], textAlign: 'right' },
  focusFrame: { position: 'absolute', left: '24%', right: '24%', top: '27%', height: 190, borderWidth: 2, borderColor: 'rgba(255,255,255,0.72)', borderRadius: 28 },
  demoCue: { position: 'absolute', left: 18, right: 18, top: 78, paddingHorizontal: 14, paddingVertical: 11, borderRadius: 15, backgroundColor: 'rgba(12,25,20,0.64)' },
  demoCueTitle: { color: '#D8B775', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  demoCueText: { marginTop: 4, color: colors.white, fontSize: 12, lineHeight: 17 },
  detectedRow: { position: 'absolute', left: 18, right: 18, bottom: 150, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  detectedChip: { paddingHorizontal: 11, paddingVertical: 8, borderRadius: radii.round, backgroundColor: 'rgba(255,250,242,0.92)' },
  detectedText: { color: colors.forest, fontSize: 10, fontWeight: '800' },
  cameraBottom: { position: 'absolute', left: 18, right: 18, bottom: 32, alignItems: 'center' },
  cameraHint: { marginBottom: 16, color: 'rgba(255,255,255,0.8)', fontSize: 12, lineHeight: 17, textAlign: 'center' },
  recordOuter: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: colors.white, borderRadius: 40 },
  recordInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.danger },
  stopInner: { width: 30, height: 30, borderRadius: 8, backgroundColor: colors.danger },
  disabled: { opacity: 0.45 },
  previewTitle: { marginTop: 12, color: colors.forestDeep, fontFamily: 'serif', fontSize: 32, lineHeight: 36 },
  previewCopy: { marginTop: 8, color: colors.inkMuted, fontSize: 14, lineHeight: 21 },
  videoFrame: { height: 360, marginVertical: 20, overflow: 'hidden', borderRadius: 26, backgroundColor: colors.forestDeep },
  videoFrameCompact: { height: 210, marginTop: 0, marginBottom: 14 },
  realBadge: { position: 'absolute', left: 12, top: 12, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10, backgroundColor: 'rgba(12,25,20,0.72)' },
  realBadgeText: { color: colors.white, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  recordingProof: { marginBottom: 18, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 19, backgroundColor: colors.sagePale },
  recordingProofIcon: { width: 34, color: colors.forest, fontSize: 25, fontWeight: '800', textAlign: 'center' },
  recordingProofTitle: { color: colors.forestDeep, fontSize: 14, fontWeight: '800' },
  recordingProofCopy: { marginTop: 4, color: colors.inkMuted, fontSize: 11, lineHeight: 16 },
  previewRetake: { marginTop: 10 },
  analysisScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30, backgroundColor: colors.cream },
  analysisOrbit: { width: 156, height: 156, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line, borderRadius: 78 },
  analysisDashed: { position: 'absolute', width: 118, height: 118, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.clay, borderRadius: 59 },
  analysisTitle: { marginTop: 26, color: colors.forestDeep, fontFamily: 'serif', fontSize: 31, textAlign: 'center' },
  analysisCopy: { maxWidth: 320, marginTop: 10, color: colors.inkMuted, fontSize: 14, lineHeight: 21, textAlign: 'center' },
  analysisList: { alignSelf: 'stretch', marginTop: 25, gap: 10 },
  analysisRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  analysisCheck: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: colors.sagePale },
  analysisCheckText: { color: colors.forest, fontSize: 11, fontWeight: '800' },
  analysisRowText: { color: colors.inkMuted, fontSize: 12 },
  analysisRowComplete: { color: colors.forest, fontWeight: '800' },
  resultBanner: { padding: 18, flexDirection: 'row', alignItems: 'center', gap: 13, borderRadius: 22, backgroundColor: colors.sagePale },
  resultIcon: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 17, backgroundColor: colors.paper },
  resultIconText: { color: colors.forest, fontSize: 24, fontWeight: '800' },
  resultTitle: { color: colors.forestDeep, fontSize: 14, fontWeight: '800' },
  resultCopy: { marginTop: 4, color: colors.inkMuted, fontSize: 11, lineHeight: 16 },
  flexOne: { flex: 1 },
  confidenceCard: { marginVertical: 22, padding: 15, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, borderRadius: 17, backgroundColor: colors.paper },
  confidenceTop: { marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' },
  confidenceLabel: { color: colors.forestDeep, fontSize: 11, fontWeight: '700' },
  reviewStatus: { color: colors.clay, fontSize: 13, fontWeight: '800' },
  languageCard: { marginBottom: 22, padding: 15, borderRadius: 17, backgroundColor: colors.clayPale },
  languageTitle: { color: colors.forestDeep, fontSize: 12, fontWeight: '800' },
  languageCopy: { marginTop: 4, color: colors.inkMuted, fontSize: 11 },
  materialsCard: { marginBottom: 22, padding: 15, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, borderRadius: 17, backgroundColor: colors.paper },
  materialsLabel: { color: colors.clay, fontSize: 9, fontWeight: '800', letterSpacing: 1.1 },
  materialsText: { marginTop: 7, color: colors.forestDeep, fontSize: 12, fontWeight: '700', lineHeight: 18 },
  materialsNote: { marginTop: 5, color: colors.inkMuted, fontSize: 10, lineHeight: 15 },
  listHeading: { color: colors.forestDeep, fontSize: 16, fontWeight: '800' },
  listSubheading: { marginTop: 4, color: colors.inkMuted, fontSize: 11 },
  stepList: { marginTop: 14, gap: 11 },
  stepCard: { padding: 15, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, borderRadius: 18, backgroundColor: colors.paper },
  stepTopline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepIndex: { color: colors.clay, fontSize: 10, fontWeight: '800', letterSpacing: 1.1, textTransform: 'uppercase' },
  insight: { paddingHorizontal: 8, paddingVertical: 6, overflow: 'hidden', borderRadius: 8, color: colors.clay, backgroundColor: colors.clayPale, fontSize: 9, fontWeight: '800' },
  stepTitle: { marginTop: 9, color: colors.forestDeep, fontSize: 14, fontWeight: '800' },
  stepCopy: { marginTop: 5, color: colors.inkMuted, fontSize: 12, lineHeight: 17 },
  confirmAction: { marginTop: 12, color: colors.clay, fontSize: 11, fontWeight: '800' },
  confirmedAction: { color: colors.forest },
  buttonRow: { marginTop: 20, flexDirection: 'row', gap: 10 },
  reviewProgress: { marginBottom: 18, flexDirection: 'row', gap: 6 },
  reviewProgressPart: { flex: 1, height: 7, borderRadius: 4, backgroundColor: colors.sagePale },
  reviewProgressActive: { backgroundColor: colors.forest },
  originalClip: { minHeight: 72, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 19, backgroundColor: colors.clayPale },
  clipPlay: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center', borderRadius: 23, backgroundColor: colors.forest },
  clipPlayText: { marginLeft: 2, color: colors.white, fontSize: 14 },
  clipTitle: { color: colors.forestDeep, fontSize: 14, fontWeight: '800' },
  clipCopy: { marginTop: 4, color: colors.inkMuted, fontSize: 11 },
  reviewCard: { minHeight: 245, marginTop: 17, padding: 23, justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, borderRadius: 27, backgroundColor: colors.paper },
  reviewStep: { color: colors.clay, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  reviewTitle: { marginTop: 11, color: colors.forestDeep, fontFamily: 'serif', fontSize: 29, lineHeight: 33 },
  reviewDetail: { marginTop: 13, color: colors.inkMuted, fontSize: 17, lineHeight: 26 },
  needsHelp: { alignSelf: 'flex-start', marginTop: 17, paddingHorizontal: 11, paddingVertical: 8, overflow: 'hidden', borderRadius: 10, color: colors.clay, backgroundColor: colors.clayPale, fontSize: 11, fontWeight: '800' },
  reviewQuestion: { marginVertical: 18, color: colors.forestDeep, fontSize: 20, fontWeight: '800', textAlign: 'center' },
  listeningCard: { marginBottom: 12, minHeight: 58, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 17, backgroundColor: colors.clayPale },
  listeningDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.danger },
  listeningText: { color: colors.forestDeep, fontSize: 13, fontWeight: '800' },
  voiceButton: { marginTop: 10 },
  reviewLater: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  reviewLaterText: { color: colors.inkMuted, fontSize: 13, textDecorationLine: 'underline' },
  retakeButton: { marginTop: 4 },
  reviewCompleteIcon: { alignSelf: 'center', width: 74, height: 74, alignItems: 'center', justifyContent: 'center', borderRadius: 37, backgroundColor: colors.sagePale },
  reviewCompleteCheck: { color: colors.forest, fontSize: 34, fontWeight: '800' },
  reviewCompleteTitle: { marginTop: 20, color: colors.forestDeep, fontFamily: 'serif', fontSize: 31, lineHeight: 35, textAlign: 'center' },
  reviewCompleteCopy: { marginTop: 8, marginBottom: 22, color: colors.inkMuted, fontSize: 13, textAlign: 'center' },
  reviewAgain: { marginTop: 10 },
  rtlText: { textAlign: 'right', writingDirection: 'rtl' },
});
