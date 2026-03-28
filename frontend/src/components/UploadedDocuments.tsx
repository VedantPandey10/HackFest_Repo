import * as React from 'react';
import { Candidate } from '../types';
import { Image, FileText, Download, ShieldCheck, User } from 'lucide-react';

interface UploadedDocumentsProps {
  candidate: Candidate | null;
  onUpdateCandidate?: (candidate: Candidate) => void;
}

export const UploadedDocuments: React.FC<UploadedDocumentsProps> = ({ candidate, onUpdateCandidate }) => {
  if (!candidate) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'pfp' | 'id-card') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (!onUpdateCandidate) return;

      if (type === 'resume') {
        onUpdateCandidate({
          ...candidate,
          resumeText: result,
          resumeFileName: file.name
        });
      } else if (type === 'pfp') {
        onUpdateCandidate({
          ...candidate,
          profilePhoto: result
        });
      } else if (type === 'id-card') {
        onUpdateCandidate({
          ...candidate,
          idCardImage: result
        });
      }
    };

    if (type === 'resume') {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  const docs = [
    {
      id: 'pfp',
      type: 'pfp',
      title: 'Profile Photo',
      description: 'Used for biometric verification.',
      image: candidate.profilePhoto,
      icon: <User className="text-brand-400" size={18} />,
      accept: "image/*"
    },
    {
      id: 'id-card',
      type: 'id-card',
      title: 'Government ID',
      description: 'Official identification document.',
      image: candidate.idCardImage,
      icon: <ShieldCheck className="text-emerald-400" size={18} />,
      accept: "image/*"
    },
    {
      id: 'resume',
      type: 'resume',
      title: 'Resume / CV',
      description: 'Professional background & skills.',
      isResume: true,
      fileName: candidate.resumeFileName,
      icon: <FileText className="text-brand-400" size={18} />,
      accept: ".txt,.pdf"
    }
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 mb-3">
          <ShieldCheck size={10} className="text-brand-500" />
          <span className="text-[9px] font-black uppercase tracking-widest text-brand-500">Secure Assets</span>
        </div>
        <h2 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
          Identity <span className="text-brand-500">& Assets</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {docs.map((doc) => (
          <div 
            key={doc.id} 
            className="group glass-card rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-white/5 overflow-hidden flex flex-col transition-all hover:border-brand-500/30"
          >
            <div className="p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
                {doc.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{doc.title}</h3>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 line-clamp-1">{doc.description}</p>
              </div>
            </div>

            <div className="px-5 pb-5 flex-1">
              <div className="aspect-[4/3] w-full rounded-2xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 overflow-hidden relative group/img flex flex-col items-center justify-center">
                {doc.isResume ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <FileText size={40} className="text-slate-300 dark:text-slate-700 mb-3" strokeWidth={1} />
                    {doc.fileName ? (
                      <div>
                        <p className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest truncate max-w-[150px]">{doc.fileName}</p>
                        <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold">Encrypted Text Content</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Resume Uploaded</p>
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg shadow-brand-500/20">
                          <Download size={12} className="rotate-180" />
                          <span>Upload PDF/TXT</span>
                          <input type="file" accept={doc.accept} className="hidden" onChange={(e) => handleFileUpload(e, doc.type as any)} />
                        </label>
                      </div>
                    )}
                  </div>
                ) : doc.image ? (
                  <>
                    <img src={doc.image} alt={doc.title} className="w-full h-full object-cover p-2 rounded-2xl" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <Image size={24} className="text-white" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div className="text-slate-300 dark:text-slate-700">
                      <ShieldCheck size={32} strokeWidth={1} />
                    </div>
                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Missing Asset</p>
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg shadow-brand-500/20">
                        <Download size={10} className="rotate-180" />
                        <span>Upload Image</span>
                        <input type="file" accept={doc.accept} className="hidden" onChange={(e) => handleFileUpload(e, doc.type as any)} />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 py-4 bg-slate-50/50 dark:bg-black/20 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                 Status: { (doc.isResume ? doc.fileName : doc.image) ? 'Verified' : 'Required' }
               </span>
               {(doc.isResume ? doc.fileName : doc.image) && (
                 <div className="flex items-center gap-2">
                    <label className="cursor-pointer text-slate-400 hover:text-brand-500 transition-colors">
                      <Download size={12} className="rotate-180" />
                      <input type="file" accept={doc.accept} className="hidden" onChange={(e) => handleFileUpload(e, doc.type as any)} />
                    </label>
                    <button 
                      className="text-brand-500 hover:text-brand-400 transition-colors"
                      onClick={() => !doc.isResume && doc.image && window.open(doc.image)}
                    >
                      <Download size={12} />
                    </button>
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
