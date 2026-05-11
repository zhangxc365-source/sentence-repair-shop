import React from 'react';
import { Language } from '../../types';

interface IntroScreenProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onBack: () => void;
}

export function IntroScreen({ language, setLanguage, onBack }: IntroScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#E4E3E0] p-8">
      <div className="max-w-2xl bg-white border-4 border-[#141414] p-10 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-black uppercase italic">
            {language === 'en' ? 'How to Play' : 'Тоглох заавар'}
          </h2>
          <div className="flex bg-[#141414] p-1 rounded border-2 border-[#141414]">
            <button 
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 text-xs font-black uppercase transition-colors ${language === 'en' ? 'bg-[#F27D26] text-[#141414]' : 'text-white hover:text-[#F27D26]'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage('mn')}
              className={`px-3 py-1 text-xs font-black uppercase transition-colors ${language === 'mn' ? 'bg-[#F27D26] text-[#141414]' : 'text-white hover:text-[#F27D26]'}`}
            >
              MN
            </button>
          </div>
        </div>
        <p className="text-xl mb-8 leading-relaxed">
          {language === 'en' 
            ? "Click or drag the word parts from the conveyor belt into the machine. Once inside, you can drag them to change their order. Match the translation shown to repair the sentence!"
            : "Конвейер дээрх үгийн хэсгүүдийг дарж эсвэл чирж машин руу оруулна уу. Машин дотор та тэдгээрийг чирж дарааллыг нь өөрчилж болно. Харуулсан орчуулгатай тааруулан өгүүлбэрийг засаарай!"}
        </p>
        <button 
          onClick={onBack}
          className="w-full bg-[#141414] text-white py-4 text-2xl font-black uppercase tracking-widest hover:bg-[#F27D26] transition-colors"
        >
          {language === 'en' ? 'Got it!' : 'Ойлголоо!'}
        </button>
      </div>
    </div>
  );
}
