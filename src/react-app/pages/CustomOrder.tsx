import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Minus, Plus, CheckCircle } from 'lucide-react';
import { api } from '../lib/api';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const SHAPES_DATA = [
  { id: 'trillion', name: 'TRILLION', type: 'faceted' },
  { id: 'oval', name: 'OVAL', type: 'faceted' },
  { id: 'round', name: 'ROUND', type: 'faceted' },
  { id: 'pear', name: 'PEAR', type: 'faceted' },
  { id: 'marquise', name: 'MARQUISE', type: 'faceted' },
  { id: 'heart', name: 'HEART', type: 'faceted' },
  { id: 'cushion', name: 'CUSHION', type: 'faceted' },
  { id: 'emerald', name: 'EMERALD', type: 'faceted' },
  { id: 'cabochon-round', name: 'CABOCHON ROUND', type: 'cabochon' },
  { id: 'cabochon-oval', name: 'CABOCHON OVAL', type: 'cabochon' },
];

const INTENSITIES = ['VERY LIGHT', 'LIGHT', 'MEDIUM INTENSE', 'INTENSE', 'VIVID', 'DEEP'];

export default function CustomOrder() {
  useDocumentTitle('Bespoke Custom Orders');
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    gemstoneType: 'Any', cut: 'Faceted', shape: '', intensity: 2,
    colorRequirements: '', treatment: 'Not treated', weight: 1.0,
    quantity: 'Single Stone', calibrated: 'No', notes: '',
    fullName: '', email: '', phone: '', contactMethod: 'E-MAIL',
  });

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  const filteredShapes = SHAPES_DATA.filter(s => s.type === formData.cut.toLowerCase());

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email) return;
    setLoading(true);
    try {
      await api.customOrder.submit({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        gemType: formData.gemstoneType,
        shape: formData.shape,
        color: formData.colorRequirements,
        budget: formData.treatment,
        notes: `Cut: ${formData.cut}, Intensity: ${INTENSITIES[formData.intensity]}, Weight: ${formData.weight}ct, Qty: ${formData.quantity}, Calibrated: ${formData.calibrated}. Contact: ${formData.contactMethod}. ${formData.notes}`,
      });
      setSubmitted(true);
    } catch {
      alert('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <CheckCircle className="w-16 h-16 text-emerald-500 mb-6" />
      <h1 className="text-4xl font-serif mb-4">Inquiry Received</h1>
      <p className="text-ivory-muted max-w-md">
        Thank you for your bespoke inquiry. Our advisory team will contact you within 24 hours at {formData.email}.
      </p>
    </div>
  );

  const steps = [
    { id: 1, label: 'SELECTION' },
    { id: 2, label: 'DETAILS' },
    { id: 3, label: 'VOLUME' },
    { id: 4, label: 'CONTACT' },
  ];

  return (
    <main className="pt-[120px] pb-24 min-h-screen bg-[#0F0D0B] text-white font-sans">
      <div className="container-luxury max-w-5xl mx-auto px-6">
        <header className="text-center mb-16">
          <span className="section-label mb-4 block">Bespoke Service</span>
          <h1 className="text-[clamp(32px,5vw,64px)] font-serif font-bold mb-6 tracking-tight">Create Your Legacy</h1>
          <p className="text-[15px] text-ivory-dim max-w-2xl mx-auto leading-relaxed">
            Specify your ideal gemstone requirements below. Our advisory team will reach out to discuss your bespoke masterpiece.
          </p>
        </header>

        {/* Progress */}
        <div className="flex justify-center items-center mb-24 relative max-w-md mx-auto">
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gold/20 -translate-y-1/2" />
          {steps.map(s => (
            <div key={s.id} className="relative z-10 flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-medium transition-all duration-500 ${
                step >= s.id ? 'bg-transparent border border-gold text-gold shadow-[0_0_15px_rgba(201,169,110,0.3)]' : 'bg-[#1A1715] border border-gold/20 text-gold/40'
              }`}>{s.id}</div>
              <span className={`absolute top-10 text-[9px] tracking-[0.2em] font-bold transition-colors duration-500 ${step >= s.id ? 'text-gold' : 'text-gold/30'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Form */}
          <div className="lg:col-span-2 bg-[#14110F] border border-gold/10 p-8 md:p-16 rounded-sm shadow-2xl">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="space-y-12">
                  <h2 className="text-2xl md:text-3xl font-serif text-center mb-8">Define the Essence</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="block text-[10px] tracking-[0.2em] text-gold font-bold uppercase">Gemstone Type</label>
                      <div className="relative">
                        <select value={formData.gemstoneType} onChange={e => setFormData({ ...formData, gemstoneType: e.target.value })}
                          className="w-full bg-[#1A1715] border border-gold/20 p-4 text-sm appearance-none focus:outline-none focus:border-gold pr-12">
                          {['Any','Sapphire','Ruby','Spinel','Tourmaline','Zircon','Garnet','Alexandrite','Other'].map(t => <option key={t}>{t}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gold pointer-events-none" size={18} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[10px] tracking-[0.2em] text-gold font-bold uppercase">Desired Cut</label>
                      <div className="flex gap-[1px] bg-gold/10 p-[1px]">
                        {['Faceted','Cabochon'].map(cut => (
                          <button key={cut} onClick={() => setFormData({ ...formData, cut, shape: '' })}
                            className={`flex-1 py-4 text-[11px] tracking-[0.1em] font-bold transition-all duration-300 ${formData.cut === cut ? 'bg-[#2A241F] text-gold border border-gold/40' : 'bg-[#1A1715] text-ivory-dim hover:bg-[#221E1A]'}`}>
                            {cut.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <label className="block text-[10px] tracking-[0.2em] text-gold font-bold uppercase">Select Shape</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {filteredShapes.map(shape => (
                        <button key={shape.id} onClick={() => setFormData({ ...formData, shape: shape.name })}
                          className={`py-4 px-2 border text-[9px] font-bold tracking-wider transition-all duration-300 ${formData.shape === shape.name ? 'border-gold text-gold bg-gold/10' : 'border-gold/10 text-ivory-muted hover:border-gold/40'}`}>
                          {shape.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-center pt-8">
                    <button onClick={handleNext} disabled={!formData.shape}
                      className="bg-[#8B7355] hover:bg-[#A68B6A] text-black px-16 py-5 text-[11px] tracking-[0.3em] font-bold transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed uppercase">
                      Begin Customization
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="space-y-12">
                  <h2 className="text-2xl md:text-3xl font-serif text-center mb-8">Refine the Specifications</h2>
                  <div className="space-y-12">
                    <div className="space-y-8">
                      <div className="flex justify-between items-end">
                        <label className="text-[10px] tracking-[0.2em] text-gold font-bold uppercase">Color Intensity:</label>
                        <span className="text-[11px] tracking-[0.1em] font-bold text-gold">{INTENSITIES[formData.intensity]}</span>
                      </div>
                      <input type="range" min="0" max="5" step="1" value={formData.intensity}
                        onChange={e => setFormData({ ...formData, intensity: parseInt(e.target.value) })}
                        className="w-full h-[1px] bg-gold/30 appearance-none cursor-pointer accent-gold" />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[10px] tracking-[0.2em] text-gold font-bold uppercase">Specific Color Requirements</label>
                      <textarea value={formData.colorRequirements} onChange={e => setFormData({ ...formData, colorRequirements: e.target.value })}
                        placeholder="e.g. Cornflower Blue, Padparadscha Orange-Pink..."
                        className="w-full bg-[#1A1715] border border-gold/20 p-6 text-sm focus:outline-none focus:border-gold resize-none h-32" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="block text-[10px] tracking-[0.2em] text-gold font-bold uppercase">Treatment</label>
                        <div className="flex gap-[1px] bg-gold/10 p-[1px]">
                          {['Treated','Not treated'].map(t => (
                            <button key={t} onClick={() => setFormData({ ...formData, treatment: t })}
                              className={`flex-1 py-4 text-[11px] tracking-[0.1em] font-bold transition-all duration-300 ${formData.treatment === t ? 'bg-[#2A241F] text-gold border border-gold/40' : 'bg-[#1A1715] text-ivory-dim hover:bg-[#221E1A]'}`}>
                              {t.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="block text-[10px] tracking-[0.2em] text-gold font-bold uppercase">Ideal Weight (CT)</label>
                        <div className="flex items-center bg-[#1A1715] border border-gold/20 h-[54px]">
                          <button onClick={() => setFormData({ ...formData, weight: Math.max(0.1, parseFloat((formData.weight - 0.1).toFixed(1))) })}
                            className="w-16 h-full flex items-center justify-center text-gold hover:bg-gold/5"><Minus size={16} /></button>
                          <div className="flex-1 text-center font-serif text-lg">{formData.weight.toFixed(1)}</div>
                          <button onClick={() => setFormData({ ...formData, weight: parseFloat((formData.weight + 0.1).toFixed(1)) })}
                            className="w-16 h-full flex items-center justify-center text-gold hover:bg-gold/5"><Plus size={16} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between pt-8">
                    <button onClick={handlePrev} className="px-12 py-4 border border-gold/40 text-[10px] tracking-[0.2em] font-bold hover:bg-gold/5 uppercase">Back</button>
                    <button onClick={handleNext} className="bg-[#C9A96E] hover:bg-[#D4B985] text-black px-12 py-4 text-[10px] tracking-[0.2em] font-bold uppercase">Next</button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="space-y-12">
                  <h2 className="text-2xl md:text-3xl font-serif text-center mb-8">Volume & Precision</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="block text-[10px] tracking-[0.2em] text-gold font-bold uppercase">Quantity</label>
                      <div className="relative">
                        <select value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                          className="w-full bg-[#1A1715] border border-gold/20 p-4 text-sm appearance-none focus:outline-none focus:border-gold pr-12">
                          {['Single Stone','Matching Pair','Layout / Set','Parcel'].map(q => <option key={q}>{q}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gold pointer-events-none" size={18} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[10px] tracking-[0.2em] text-gold font-bold uppercase">Calibrated?</label>
                      <div className="flex gap-[1px] bg-gold/10 p-[1px]">
                        {['Yes','No'].map(opt => (
                          <button key={opt} onClick={() => setFormData({ ...formData, calibrated: opt })}
                            className={`flex-1 py-4 text-[11px] tracking-[0.1em] font-bold transition-all duration-300 ${formData.calibrated === opt ? 'bg-[#2A241F] text-gold border border-gold/40' : 'bg-[#1A1715] text-ivory-dim hover:bg-[#221E1A]'}`}>
                            {opt.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-[10px] tracking-[0.2em] text-gold font-bold uppercase">Additional Notes</label>
                    <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Share any specific artistic vision or technical constraints..."
                      className="w-full bg-[#1A1715] border border-gold/20 p-6 text-sm focus:outline-none focus:border-gold resize-none h-48" />
                  </div>
                  <div className="flex justify-between pt-8">
                    <button onClick={handlePrev} className="px-12 py-4 border border-gold/40 text-[10px] tracking-[0.2em] font-bold hover:bg-gold/5 uppercase">Back</button>
                    <button onClick={handleNext} className="bg-[#C9A96E] hover:bg-[#D4B985] text-black px-12 py-4 text-[10px] tracking-[0.2em] font-bold uppercase">Next</button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="s4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="space-y-12">
                  <h2 className="text-2xl md:text-3xl font-serif text-center mb-8">Secure Your Consultation</h2>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="block text-[9px] tracking-[0.2em] text-gold font-bold uppercase">Full Name *</label>
                        <input type="text" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full bg-[#1A1715] border border-gold/20 p-4 text-sm focus:outline-none focus:border-gold" />
                      </div>
                      <div className="space-y-3">
                        <label className="block text-[9px] tracking-[0.2em] text-gold font-bold uppercase">Email Address *</label>
                        <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-[#1A1715] border border-gold/20 p-4 text-sm focus:outline-none focus:border-gold" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[9px] tracking-[0.2em] text-gold font-bold uppercase">Phone (Optional)</label>
                      <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000" className="w-full bg-[#1A1715] border border-gold/20 p-4 text-sm focus:outline-none focus:border-gold" />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[9px] tracking-[0.2em] text-gold font-bold uppercase">Preferred Contact Method</label>
                      <div className="flex flex-wrap gap-[1px] bg-gold/10 p-[1px]">
                        {['CALL ME BACK','E-MAIL','ONLINE MEETING'].map(method => (
                          <button key={method} onClick={() => setFormData({ ...formData, contactMethod: method })}
                            className={`flex-1 min-w-[120px] py-4 text-[10px] tracking-[0.1em] font-bold transition-all duration-300 ${formData.contactMethod === method ? 'bg-[#2A241F] text-gold border border-gold/40' : 'bg-[#1A1715] text-ivory-dim hover:bg-[#221E1A]'}`}>
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between pt-8">
                    <button onClick={handlePrev} className="px-12 py-4 border border-gold/40 text-[10px] tracking-[0.2em] font-bold hover:bg-gold/5 uppercase">Back</button>
                    <button onClick={handleSubmit} disabled={loading || !formData.fullName || !formData.email}
                      id="submit-custom-order-btn"
                      className="bg-[#7A6A4F] hover:bg-[#8B7A5E] text-ivory px-12 py-4 text-[10px] tracking-[0.2em] font-bold uppercase disabled:opacity-50">
                      {loading ? 'Submitting...' : 'Submit Inquiry'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Summary */}
          <aside className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-[#1A1715] border border-gold/20 p-8 rounded-sm sticky top-[140px]">
              <h3 className="text-[10px] tracking-[0.3em] text-gold font-bold uppercase mb-8 pb-4 border-b border-gold/10">Selection Summary</h3>
              <div className="space-y-6">
                <div>
                  <div className="text-[9px] tracking-[0.1em] text-gold/50 font-bold uppercase mb-1">Gemstone</div>
                  <div className="text-sm font-serif">{formData.gemstoneType}</div>
                  <div className="text-[10px] text-ivory-dim">{formData.shape || '---'} · {formData.cut}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Intensity', value: INTENSITIES[formData.intensity] },
                    { label: 'Weight', value: `${formData.weight.toFixed(1)} CT` },
                    { label: 'Treatment', value: formData.treatment },
                    { label: 'Quantity', value: formData.quantity },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="text-[8px] tracking-[0.1em] text-gold/50 font-bold uppercase mb-1">{item.label}</div>
                      <div className="text-[11px] font-medium">{item.value}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-4 bg-gold/5 border border-gold/10">
                  <p className="text-[9px] text-gold/70 leading-relaxed">
                    {step === 1 && 'Choose your preferred gemstone type and geometric cut to begin.'}
                    {step === 2 && 'Refine the visual characteristics and weight of your stone.'}
                    {step === 3 && 'Specify the volume and any additional requirements.'}
                    {step === 4 && 'Provide your contact details for a personalized consultation.'}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
