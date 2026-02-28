import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface SuggestModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export default function SuggestModal({ isOpen, onClose, showToast }: SuggestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const companyName = formData.get('companyName') as string;
    const contactUrl = formData.get('contactUrl') as string;
    const notes = formData.get('notes') as string;

    const WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK_URL;

    if (!WEBHOOK_URL) {
      showToast('⚠️ ระบบยังไม่ได้ตั้งค่า Webhook URL ในไฟล์ .env');
      setIsSubmitting(false);
      return;
    }

    // ลบ username กับ avatar_url ออก เพื่อให้ใช้ค่า Default ของ Webhook
    // และจัดรูปแบบ Embed ใหม่ให้อ่านง่ายขึ้นแบบเป็นสัดส่วน
    const payload = {
      content: "✨ ฮาโหลลลล! พี่ๆ ขาาา น้องน้ำแดงมีที่ฝึกงานใหม่มาฝากค่าาา! รีบมาดูกันเร็ววว เย้! 🎉",
      embeds: [
        {
          title: `🏢 บริษัท: ${companyName}`,
          url: contactUrl,
          color: 16724530, // สีแดง-ชมพู
          fields: [
            {
              name: "🔗 ลิงก์ข้อมูล / ประกาศรับสมัคร",
              value: contactUrl,
              inline: false
            },
            {
              name: "📝 โน้ตกระซิบจากผู้แนะนำ",
              value: notes ? notes : "ไม่มีโน้ตเพิ่มเติมค่า แต่หนูว่าน่าสนใจน้าา!",
              inline: false
            }
          ],
          footer: {
            text: "👇 แอดมินพิจารณาแล้ว รบกวนกด React ด้านล่างด้วยนะค้าา (✅ รับลงเว็บ / ❌ ปฏิเสธ)"
          },
          timestamp: new Date().toISOString(),
        }
      ]
    };

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showToast('น้องน้ำแดงส่งข้อมูลให้พี่ๆ แอดมินแล้วค่า! ขอบคุณน้าา 🍓');
        onClose();
      } else {
        showToast('แงงง ส่งข้อมูลไม่สำเร็จ ลองใหม่อีกทีน้าา');
      }
    } catch (error) {
      showToast('การเชื่อมต่อมีปัญหาค่าาา 😢');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-zinc-800">
            <h2 className="text-xl font-bold text-zinc-100">Suggest a Company 🍓</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form className="p-6 flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="companyName" className="text-sm font-medium text-zinc-300">ชื่อบริษัทค่า (Company Name)</label>
              <input 
                type="text" 
                id="companyName" 
                name="companyName"
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                placeholder="เช่น PixelForge Studios"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="contactUrl" className="text-sm font-medium text-zinc-300">ลิงก์รับสมัคร (Job Posting Link)</label>
              <input 
                type="url" 
                id="contactUrl" 
                name="contactUrl"
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
                placeholder="https://..."
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="notes" className="text-sm font-medium text-zinc-300">โน้ตเพิ่มเติม (Senior's Note)</label>
              <textarea 
                id="notes" 
                name="notes"
                rows={3}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all resize-none"
                placeholder="มีทริคอะไรบอกเพื่อนๆ ไหมค้าา?"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button 
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                ยกเลิกก่อน
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-sm font-medium bg-red-500 hover:bg-red-400 text-white transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)] flex items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                ส่งให้น้องน้ำแดงเลย!
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}