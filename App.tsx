
import React, { useState, useCallback, useEffect } from 'react';
import { SOURCE_LANGUAGES, TARGET_LANGUAGES, Language } from './constants';
import { translateText } from './services/geminiService';

// --- Icon Components (defined outside App to prevent re-creation on re-renders) ---

const SwapIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
);

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375V9.375m0-3.75H9.375m0 0a3.001 3.001 0 003.75 0M9.375 6.375a3.001 3.001 0 00-3.75 0m7.5 0v-.375c0-.621-.504-1.125-1.125-1.125H9.375a1.125 1.125 0 00-1.125 1.125v.375m7.5 0a3.001 3.001 0 00-7.5 0" />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

const LoaderIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 1.5a8.25 8.25 0 100 16.5 8.25 8.25 0 000-16.5z" clipRule="evenodd" opacity=".2"/>
        <path d="M12 2.25a.75.75 0 01.75.75v.549a8.25 8.25 0 000 15.902v.549a.75.75 0 01-1.5 0v-.549a8.25 8.25 0 000-15.902V3a.75.75 0 01.75-.75z" />
    </svg>
);

const App: React.FC = () => {
    const [sourceLang, setSourceLang] = useState<string>('auto');
    const [targetLang, setTargetLang] = useState<string>('es');
    const [sourceText, setSourceText] = useState<string>('');
    const [translatedText, setTranslatedText] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState<boolean>(false);

    const handleTranslate = useCallback(async () => {
        if (!sourceText.trim()) {
            setTranslatedText('');
            return;
        }
        setIsLoading(true);
        setError(null);
        setTranslatedText('');

        const sourceLanguageName = SOURCE_LANGUAGES.find(l => l.code === sourceLang)?.name || 'Auto-Detect';
        const targetLanguageName = TARGET_LANGUAGES.find(l => l.code === targetLang)?.name || 'English';

        const result = await translateText(sourceText, sourceLanguageName, targetLanguageName);

        if (result.startsWith('Error:')) {
            setError(result);
        } else {
            setTranslatedText(result);
        }
        setIsLoading(false);
    }, [sourceText, sourceLang, targetLang]);

    const handleSwapLanguages = () => {
        if (sourceLang === 'auto') return;

        const newSourceLang = targetLang;
        const newTargetLang = sourceLang;

        setSourceLang(newSourceLang);
        setTargetLang(newTargetLang);
        setSourceText(translatedText);
        setTranslatedText(sourceText);
    };

    const handleCopy = () => {
        if (!translatedText) return;
        navigator.clipboard.writeText(translatedText);
        setIsCopied(true);
    };

    useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => setIsCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isCopied]);

    const LanguageSelect: React.FC<{
        id: string;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
        languages: Language[];
    }> = ({ id, value, onChange, languages }) => (
        <select
            id={id}
            value={value}
            onChange={onChange}
            className="w-full bg-slate-700/50 text-slate-200 border border-slate-600 rounded-md py-2 px-3 focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
        >
            {languages.map(lang => (
                <option key={lang.code} value={lang.code} className="bg-slate-800 text-slate-200">
                    {lang.name}
                </option>
            ))}
        </select>
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-900 text-slate-100">
            <header className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
                    AI Language Translator
                </h1>
                <p className="text-slate-400 mt-2">Powered by Shyam Sunder</p>
            </header>

            <main className="w-full max-w-5xl mx-auto bg-slate-800/50 rounded-xl shadow-2xl shadow-slate-950/50 border border-slate-700 p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4 items-center relative">
                    {/* Source Text Area */}
                    <div className="flex flex-col gap-4">
                        <LanguageSelect id="source-lang" value={sourceLang} onChange={e => setSourceLang(e.target.value)} languages={SOURCE_LANGUAGES} />
                        <textarea
                            id="source-text"
                            value={sourceText}
                            onChange={e => setSourceText(e.target.value)}
                            placeholder="Enter text to translate..."
                            className="h-60 md:h-72 w-full p-4 bg-slate-900/70 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none text-slate-200 placeholder-slate-500"
                        />
                    </div>

                    {/* Swap Button */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 my-4 md:my-0 flex justify-center">
                        <button
                            onClick={handleSwapLanguages}
                            disabled={sourceLang === 'auto'}
                            className="z-10 flex items-center justify-center w-12 h-12 bg-slate-700 text-slate-300 rounded-full border border-slate-600 hover:bg-sky-600 hover:text-white disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-all duration-200"
                            aria-label="Swap languages"
                            title={sourceLang === 'auto' ? "Select a specific source language to swap" : "Swap languages"}
                        >
                            <SwapIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Translated Text Area */}
                    <div className="flex flex-col gap-4 relative">
                        <LanguageSelect id="target-lang" value={targetLang} onChange={e => setTargetLang(e.target.value)} languages={TARGET_LANGUAGES} />
                        <div className="relative h-60 md:h-72 w-full">
                            <textarea
                                id="translated-text"
                                value={translatedText}
                                readOnly
                                placeholder="Translation will appear here..."
                                className="h-full w-full p-4 bg-slate-900/70 border border-slate-700 rounded-lg focus:outline-none resize-none text-slate-200 placeholder-slate-500"
                            />
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
                                    <LoaderIcon className="w-8 h-8 text-sky-400 animate-spin" />
                                </div>
                            )}
                            {!isLoading && translatedText && (
                                <button
                                    onClick={handleCopy}
                                    className="absolute top-3 right-3 p-2 text-slate-400 hover:text-sky-400 transition"
                                    aria-label="Copy translated text"
                                    title="Copy"
                                >
                                    {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mt-6 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center">
                        {error}
                    </div>
                )}

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleTranslate}
                        disabled={!sourceText.trim() || isLoading}
                        className="w-full max-w-xs px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {isLoading ? 'Translating...' : 'Translate'}
                    </button>
                </div>
            </main>
            <footer className="text-center mt-8 text-slate-500 text-sm">
                <p>&copy; {new Date().getFullYear()} - Built for Demonstration</p>
            </footer>
        </div>
    );
};

export default App;
