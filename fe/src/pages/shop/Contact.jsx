import { useState } from 'react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Chỗ này sau này có thể gắn API (như EmailJS) để gửi email thật
    toast.success('Tin nhắn đã được gửi! Chúng tôi sẽ phản hồi sớm nhất.', { icon: '✅', style: { borderRadius: '10px', background: '#333', color: '#fff' } });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 w-full py-16 relative overflow-hidden font-sans">
      
      {/* Background Decor (Modern Soft Circles) */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-100 rounded-none blur-[100px] opacity-60 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-50 rounded-none blur-[120px] opacity-60 translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Header Trang */}
        <div className="mb-14 text-center md:text-left border-b border-gray-200 pb-8">
          <p className="text-orange-500 font-bold tracking-[0.2em] text-sm uppercase mb-3">Hỗ trợ khách hàng</p>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-blue-600">
            LIÊN HỆ <span className="text-slate-800">CHÚNG TÔI</span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          
          {/* CỘT TRÁI: THÔNG TIN LIÊN LẠC */}
          <div className="w-full lg:w-5/12 space-y-8">
            <p className="text-slate-500 leading-relaxed text-sm md:text-base font-medium">
              Bạn cần hỗ trợ về các mẫu Gunpla, tìm hiểu về khóa học, hay kiểm tra tình trạng đơn hàng? Đừng ngần ngại để lại lời nhắn, đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn.
            </p>

            <div className="space-y-5">
              {/* Địa chỉ */}
              <div className="flex items-start gap-5 p-6 bg-white border border-gray-100 rounded-none hover:shadow-md hover:border-blue-100 transition-all duration-300 group">
                <div className="w-12 h-12 bg-blue-50 rounded-none flex items-center justify-center flex-shrink-0 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase text-slate-800 tracking-wide mb-1.5">Văn phòng chính</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">Đại học Công Nghệ Sài Gòn (STU)<br/>180 Cao Lỗ, Phường 4, Quận 8, TP.HCM</p>
                </div>
              </div>

              {/* Hotline */}
              <div className="flex items-start gap-5 p-6 bg-white border border-gray-100 rounded-none hover:shadow-md hover:border-blue-100 transition-all duration-300 group">
                <div className="w-12 h-12 bg-blue-50 rounded-none flex items-center justify-center flex-shrink-0 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.08-7.074-6.959l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase text-slate-800 tracking-wide mb-1.5">Hotline hỗ trợ</h4>
                  <p className="text-orange-500 font-black text-lg">0909.123.456</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-5 p-6 bg-white border border-gray-100 rounded-none hover:shadow-md hover:border-blue-100 transition-all duration-300 group">
                <div className="w-12 h-12 bg-blue-50 rounded-none flex items-center justify-center flex-shrink-0 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase text-slate-800 tracking-wide mb-1.5">Email liên hệ</h4>
                  <p className="text-slate-500 text-sm font-medium">support@gundamstore.vn</p>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: FORM GỬI TIN NHẮN */}
          <div className="w-full lg:w-7/12">
            <div className="bg-white p-8 md:p-10 rounded-none border border-gray-100 shadow-xl shadow-slate-200/50">
              
              <h3 className="text-2xl font-black uppercase text-slate-800 mb-8 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                Gửi tin nhắn cho chúng tôi
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Họ và tên</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Nhập tên của bạn" className="w-full bg-slate-50 border border-gray-200 text-slate-800 rounded-none px-4 py-3.5 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Địa chỉ Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="example@email.com" className="w-full bg-slate-50 border border-gray-200 text-slate-800 rounded-none px-4 py-3.5 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"/>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Chủ đề</label>
                  <input type="text" name="subject" value={formData.subject} onChange={handleChange} required placeholder="Vấn đề bạn cần hỗ trợ" className="w-full bg-slate-50 border border-gray-200 text-slate-800 rounded-none px-4 py-3.5 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"/>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nội dung tin nhắn</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} required rows="5" placeholder="Chi tiết yêu cầu của bạn..." className="w-full bg-slate-50 border border-gray-200 text-slate-800 rounded-none px-4 py-3.5 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"></textarea>
                </div>

                <button type="submit" className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase text-sm tracking-widest rounded-none transition-all shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/40 active:scale-[0.98] flex items-center justify-center gap-2 mt-2">
                  Gửi Tin Nhắn
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;