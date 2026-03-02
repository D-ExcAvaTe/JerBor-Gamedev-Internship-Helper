import { X, Loader2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
  internshipName: string;
}

export default function ReportModal({ isOpen, onClose, showToast, internshipName }: ReportModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const issueType = formData.get('issueType') as string;
    const notes = formData.get('notes') as string;

    const WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK_URL;

    if (!WEBHOOK_URL) {
      showToast('⚠️ ระบบยังไม่ได้ตั้งค่า Webhook URL ในไฟล์ .env');
      setIsSubmitting(false);
      return;
    }

    // จัดรูปแบบ Embed ให้สอดคล้องกับ SuggestModal แต่เป็นสีแดงสำหรับการแจ้งเตือน
    const payload = {
      content: "🚨🚨🚨 **ติ๊งหน่อง! พี่ๆ ขาาา มีคนรายงานมาผ่านน้องน้ำแดงค่ะ รีบมาดูกันเร็ววว!!!!🚨🚨🚨**",
      embeds: [
        {
          title: `📌 บริษัท: ${internshipName}`,
          color: 16711680, // สีแดง Red
          fields: [
            {
              name: "📋 ประเภทปัญหา",
              value: issueType,
              inline: false
            },
            {
              name: "📝 รายละเอียดเพิ่มเติม",
              value: notes ? notes : "ไม่มีการระบุรายละเอียดเพิ่มเติม"
            }
          ],
          footer: {
            text: "Reported via JerBor Gamedev Internship Helper"
          },
          timestamp: new Date().toISOString()
        }
      ]
    };

    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      showToast('✅ ส่งรายงานเรียบร้อยแล้ว ขอบคุณที่ช่วยอัปเดตข้อมูลนะคะ!');
      onClose();
    } catch (error) {
      showToast('❌ ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
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
        className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-zinc-950 border border-red-500/30 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-red-500/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-zinc-100 tracking-tight">รายงานข้อมูลผิดพลาด</h2>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-5">
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                คุณเจอปัญหาอะไรเกี่ยวกับบริษัทนี้?
              </label>
              <select
                name="issueType"
                required
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all appearance-none"
                disabled={isSubmitting}
              >
                <option value="บริษัทปิดรับสมัครแล้ว">🛑 บริษัทปิดรับสมัครไปแล้ว</option>
                <option value="ลิงก์ประกาศรับสมัครเสีย / เข้าไม่ได้">🔗 ลิงก์ประกาศรับสมัครเสีย / เข้าไม่ได้</option>
                <option value="ข้อมูลเบี้ยเลี้ยง/สถานที่ผิดพลาด">💰 ข้อมูลเบี้ยเลี้ยง/สถานที่ผิดพลาด</option>
                <option value="บริษัทนี้ไม่มีอยู่จริง / สแปม">🚫 บริษัทนี้ไม่มีอยู่จริง / สแปม</option>
                <option value="ปัญหาอื่นๆ">📝 ปัญหาอื่นๆ (ระบุด้านล่าง)</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                รายละเอียดเพิ่มเติม (บอกเราหน่อยว่าแก้ตรงไหนดี)
              </label>
              <textarea
                name="notes"
                rows={3}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all resize-none"
                placeholder="เช่น เปลี่ยนที่อยู่เป็นตึก xxx, เปลี่ยนค่าตอบแทนเป็น xxx บาท..."
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-500 text-white transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)] flex items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    กำลังส่งข้อมูล...
                  </>
                ) : (
                  'ส่งรายงาน'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}