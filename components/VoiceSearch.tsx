import React, { useState, useRef, useEffect } from 'react';

interface VoiceSearchProps {
  onAudioCapture: (base64Data: string, mimeType: string) => void;
  onCancel: () => void;
}

const VoiceSearch: React.FC<VoiceSearchProps> = ({ onAudioCapture, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' }); // Defaulting to webm, common in browsers
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64String = reader.result as string;
            // remove prefix "data:audio/webm;base64,"
            const base64Data = base64String.split(',')[1];
            // Extract actual mime type from the blob or the reader result prefix if needed, 
            // but for Gemini 'audio/webm' or 'audio/mp4' is usually fine.
            // We'll pass the full mime type extracted from the blob if possible, or default.
            onAudioCapture(base64Data, blob.type || 'audio/webm');
        };
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Não foi possível acessar o microfone. Verifique as permissões.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 animate-fade-in text-center">
      <h2 className="text-2xl font-bold text-sky-400 mb-6">Conte-nos o que você procura</h2>
      
      {error ? (
        <div className="mb-6 text-red-400 bg-red-900/20 p-4 rounded-lg">
            {error}
            <button onClick={() => setError(null)} className="block mt-2 text-sm underline">Tentar novamente</button>
        </div>
      ) : (
        <div className="mb-8 relative flex justify-center items-center h-32">
            {isRecording ? (
                <>
                   <div className="absolute w-24 h-24 bg-red-500/30 rounded-full animate-ping"></div>
                   <div className="relative z-10">
                        <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                                <line x1="12" y1="19" x2="12" y2="23"></line>
                                <line x1="8" y1="23" x2="16" y2="23"></line>
                            </svg>
                        </div>
                   </div>
                   <p className="absolute -bottom-8 text-red-400 font-medium animate-pulse">Ouvindo...</p>
                </>
            ) : (
                <button 
                    onClick={startRecording}
                    className="w-20 h-20 bg-slate-700 hover:bg-sky-600 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 group-hover:text-white">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" y1="19" x2="12" y2="23"></line>
                        <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                </button>
            )}
        </div>
      )}

      <p className="text-slate-400 mb-8 text-sm">
        {isRecording 
            ? "Diga coisas como: 'Procuro um SUV até 80 mil para viajar com a família'" 
            : "Clique no microfone e descreva seu carro ideal"}
      </p>

      <div className="flex gap-4 justify-center">
        <button
            onClick={onCancel}
            className="px-6 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
        >
            Voltar
        </button>
        {isRecording && (
            <button
                onClick={stopRecording}
                className="px-6 py-2 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-900/30"
            >
                Buscar Carros
            </button>
        )}
      </div>
    </div>
  );
};

export default VoiceSearch;