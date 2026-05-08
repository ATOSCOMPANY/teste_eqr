/**
 * AudioRecorder Component
 * Componente para gravar áudio do navegador e transcrever
 */

import { useState, useRef } from 'react';
import { Mic, Square, Play, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AudioRecorderProps {
  onRecordingComplete?: (audioBlob: Blob, transcript?: string) => void;
}

export default function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string>('');
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      alert('Não foi possível acessar o microfone. Verifique as permissões.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscribe = async () => {
    if (!audioURL) return;

    setIsTranscribing(true);
    try {
      // Simula transcrição - em produção, conectar com Whisper API
      // Por enquanto, mostra um placeholder
      setTimeout(() => {
        setTranscript(
          'Transcrição de áudio (integração com Whisper API necessária para funcionalidade completa)'
        );
        setIsTranscribing(false);
        if (onRecordingComplete && audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          onRecordingComplete(audioBlob, transcript);
        }
      }, 2000);
    } catch (error) {
      console.error('Erro ao transcrever:', error);
      setIsTranscribing(false);
    }
  };

  const handleClear = () => {
    setAudioURL('');
    setTranscript('');
    audioChunksRef.current = [];
  };

  const handleDownload = () => {
    if (audioURL) {
      const a = document.createElement('a');
      a.href = audioURL;
      a.download = `gravacao-${new Date().getTime()}.wav`;
      a.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* Recording Controls */}
      {!audioURL ? (
        <div className="rounded-lg border-2 border-dashed border-green-300 bg-green-50 p-6">
          <div className="flex flex-col items-center gap-4">
            <div
              className={cn(
                'flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300',
                isRecording
                  ? 'bg-red-500 animate-pulse'
                  : 'bg-green-500 hover:bg-green-600'
              )}
            >
              <Mic className="h-8 w-8 text-white" />
            </div>

            <div className="text-center">
              <p className="font-semibold text-gray-900">
                {isRecording ? 'Gravando...' : 'Pronto para gravar'}
              </p>
              <p className="text-sm text-gray-600">
                {isRecording
                  ? 'Clique em Parar para finalizar'
                  : 'Clique em Gravar para iniciar'}
              </p>
            </div>

            {isRecording ? (
              <Button
                onClick={stopRecording}
                className="bg-red-600 hover:bg-red-700"
              >
                <Square className="mr-2 h-4 w-4" />
                Parar Gravação
              </Button>
            ) : (
              <Button
                onClick={startRecording}
                className="bg-green-600 hover:bg-green-700"
              >
                <Mic className="mr-2 h-4 w-4" />
                Iniciar Gravação
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Audio Player */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="mb-3 text-sm font-semibold text-gray-900">Áudio Gravado</p>
            <audio
              ref={audioRef}
              controls
              src={audioURL}
              className="w-full rounded-lg bg-gray-100"
            />
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownload}
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                Baixar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleClear}
                className="flex-1 text-red-600 hover:text-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Limpar
              </Button>
            </div>
          </div>

          {/* Transcription */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Transcrição</p>
              {!transcript && (
                <Button
                  size="sm"
                  onClick={handleTranscribe}
                  disabled={isTranscribing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isTranscribing ? (
                    <>
                      <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Transcrevendo...
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" />
                      Transcrever
                    </>
                  )}
                </Button>
              )}
            </div>

            {transcript ? (
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-sm text-gray-700">{transcript}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                Clique em "Transcrever" para converter o áudio em texto
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
