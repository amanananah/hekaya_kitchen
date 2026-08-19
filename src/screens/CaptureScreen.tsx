import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BrandMark } from '../components/BrandMark';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import { SubscreenHeader } from '../components/SubscreenHeader';
import { extractedSteps } from '../data';
import { colors, radii } from '../theme';
import type { CapturePhase } from '../types';

type CaptureScreenProps = {
  phase: CapturePhase;
  onBack: () => void;
  onBegin: () => void;
  onRecorded: (uri?: string) => void;
  onRetake: () => void;
  onSave: () => void;
};

export function CaptureScreen(props: CaptureScreenProps) {
  if (props.phase === 'camera') return <NativeCamera onBack={props.onRetake} onRecorded={props.onRecorded} />;
  if (props.phase === 'analysis') return <AnalysisScreen />;
  if (props.phase === 'result') return <ResultScreen onBack={props.onBack} onRetake={props.onRetake} onSave={props.onSave} />;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} style={styles.screen}>
      <SubscreenHeader title="Capture a recipe" subtitle="Grandma can simply cook as usual" onBack={props.onBack} />
      <Text style={styles.eyebrow}>A QUIET AI APPRENTICE</Text>
      <Text style={styles.title}>Keep the phone nearby. Let the memory unfold.</Text>
      <Text style={styles.body}>
        Mirath watches for actions and textures while preserving the original voice. It asks questions only after the cooking is finished.
      </Text>

      <View style={styles.introArt}>
        <View style={styles.introOrbit} />
        <View style={styles.phone}>
          <View style={styles.phoneLens}><View style={styles.phoneDot} /></View>
        </View>
      </View>

      <View style={styles.tipList}>
        <Tip number="1" text="Keep the ingredients and hands visible when possible." />
        <Tip number="2" text="Speak naturally in Arabic, English or your family dialect." />
        <Tip number="3" text="Mirath will mark uncertain quantities for confirmation." />
      </View>
      <PrimaryButton onPress={props.onBegin}>Begin demonstration</PrimaryButton>
    </ScrollView>
  );
}

function NativeCamera({ onBack, onRecorded }: { onBack: () => void; onRecorded: (uri?: string) => void }) {
  const cameraRef = useRef<CameraView | null>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const [ready, setReady] = useState(false);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);

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
    setRecording(true);
    try {
      const result = await cameraRef.current.recordAsync({ maxDuration: 120 });
      onRecorded(result?.uri);
    } catch {
      Alert.alert('Recording stopped', 'Mirath could not keep this recording. Please try again.');
      setRecording(false);
    }
  }

  function stopRecording() {
    if (!recording) return;
    cameraRef.current?.stopRecording();
    setRecording(false);
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
          Mirath needs both to preserve the cooking demonstration and the cook's original voice.
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
        <Pressable accessibilityLabel="Cancel recording" onPress={onBack} style={styles.cameraBack}>
          <Text style={styles.cameraBackText}>×</Text>
        </Pressable>
        <View style={styles.liveBadge}>
          <View style={[styles.liveDot, !recording && styles.liveDotIdle]} />
          <Text style={styles.liveText}>{recording ? 'Mirath is observing' : 'Ready to capture'}</Text>
        </View>
        <Text style={styles.timer}>{formatDuration(elapsed)}</Text>
      </View>
      <View style={styles.focusFrame} />
      {recording ? (
        <View style={styles.detectedRow}>
          <DetectedChip text="Hands in view" />
          <DetectedChip text="Voice detected" />
          <DetectedChip text="Mixing action" />
        </View>
      ) : null}
      <View style={styles.cameraBottom}>
        <Text style={styles.cameraHint}>
          {recording ? 'Keep cooking naturally—no need to explain every detail.' : 'Frame the hands and ingredients, then tap record.'}
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

function AnalysisScreen() {
  return (
    <View style={styles.analysisScreen}>
      <View style={styles.analysisOrbit}>
        <View style={styles.analysisDashed} />
        <BrandMark size={72} />
      </View>
      <Text style={styles.analysisTitle}>Finding the unwritten details</Text>
      <Text style={styles.analysisCopy}>
        Mirath is separating the steps, listening for family stories and saving the moments where “it looks right.”
      </Text>
      <View style={styles.analysisList}>
        <AnalysisRow complete text="Cooking actions detected" />
        <AnalysisRow complete text="Original voice preserved" />
        <AnalysisRow text="Building visual checkpoints…" />
      </View>
    </View>
  );
}

function ResultScreen({ onBack, onRetake, onSave }: { onBack: () => void; onRetake: () => void; onSave: () => void }) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} style={styles.screen}>
      <SubscreenHeader title="Your living recipe" subtitle="Captured from Grandma Fatima" onBack={onBack} />
      <View style={styles.resultBanner}>
        <View style={styles.resultIcon}><Text style={styles.resultIconText}>✓</Text></View>
        <View style={styles.flexOne}>
          <Text style={styles.resultTitle}>Mirath found 5 teachable moments</Text>
          <Text style={styles.resultCopy}>Review uncertain details with Grandma before saving.</Text>
        </View>
      </View>
      <View style={styles.confidenceCard}>
        <View style={styles.confidenceTop}><Text style={styles.confidenceLabel}>Recipe confidence</Text><Text style={styles.confidenceLabel}>86%</Text></View>
        <View style={styles.confidenceTrack}><View style={styles.confidenceFill} /></View>
      </View>
      <Text style={styles.listHeading}>What Mirath understood</Text>
      <Text style={styles.listSubheading}>The demonstration has become a first draft</Text>
      <View style={styles.stepList}>
        {extractedSteps.map((step) => (
          <View key={step.index} style={styles.stepCard}>
            <View style={styles.stepTopline}><Text style={styles.stepIndex}>{step.index}</Text><Text style={styles.insight}>{step.insight}</Text></View>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepCopy}>{step.detail}</Text>
          </View>
        ))}
      </View>
      <View style={styles.buttonRow}>
        <SecondaryButton onPress={onRetake} style={styles.flexOne}>Retake</SecondaryButton>
        <PrimaryButton onPress={onSave} style={styles.flexOne}>Save recipe</PrimaryButton>
      </View>
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
  detectedRow: { position: 'absolute', left: 18, right: 18, bottom: 150, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  detectedChip: { paddingHorizontal: 11, paddingVertical: 8, borderRadius: radii.round, backgroundColor: 'rgba(255,250,242,0.92)' },
  detectedText: { color: colors.forest, fontSize: 10, fontWeight: '800' },
  cameraBottom: { position: 'absolute', left: 18, right: 18, bottom: 32, alignItems: 'center' },
  cameraHint: { marginBottom: 16, color: 'rgba(255,255,255,0.8)', fontSize: 12, lineHeight: 17, textAlign: 'center' },
  recordOuter: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: colors.white, borderRadius: 40 },
  recordInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.danger },
  stopInner: { width: 30, height: 30, borderRadius: 8, backgroundColor: colors.danger },
  disabled: { opacity: 0.45 },
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
  confidenceTrack: { height: 7, overflow: 'hidden', borderRadius: 4, backgroundColor: colors.sagePale },
  confidenceFill: { width: '86%', height: 7, borderRadius: 4, backgroundColor: colors.forest },
  listHeading: { color: colors.forestDeep, fontSize: 16, fontWeight: '800' },
  listSubheading: { marginTop: 4, color: colors.inkMuted, fontSize: 11 },
  stepList: { marginTop: 14, gap: 11 },
  stepCard: { padding: 15, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line, borderRadius: 18, backgroundColor: colors.paper },
  stepTopline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepIndex: { color: colors.clay, fontSize: 10, fontWeight: '800', letterSpacing: 1.1, textTransform: 'uppercase' },
  insight: { paddingHorizontal: 8, paddingVertical: 6, overflow: 'hidden', borderRadius: 8, color: colors.clay, backgroundColor: colors.clayPale, fontSize: 9, fontWeight: '800' },
  stepTitle: { marginTop: 9, color: colors.forestDeep, fontSize: 14, fontWeight: '800' },
  stepCopy: { marginTop: 5, color: colors.inkMuted, fontSize: 12, lineHeight: 17 },
  buttonRow: { marginTop: 20, flexDirection: 'row', gap: 10 },
});
