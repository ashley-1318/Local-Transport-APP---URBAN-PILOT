import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl relative">
      <div className="h-screen flex flex-col justify-center p-6 bg-gradient-to-br from-slate-900 via-transport-blue to-transport-green relative overflow-hidden">
        {/* Background animated elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl float-animation"></div>
          <div className="absolute bottom-32 right-8 w-24 h-24 bg-transport-green rounded-full blur-2xl float-animation" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-transport-blue to-transport-green rounded-full blur-3xl opacity-30 float-animation" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="text-center mb-8 relative z-10 fade-in">
          <div className="bg-white/20 glass-effect rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6 pulse-glow interactive-scale">
            <i className="fas fa-route text-white text-4xl"></i>
          </div>
          <h1 className="text-white text-4xl font-bold mb-3 tracking-tight">SmartTransit</h1>
          <p className="text-white/90 text-xl font-light">AI-Powered Local Transport</p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-white/60 rounded-full pulse-glow"></div>
            <div className="w-2 h-2 bg-white/60 rounded-full pulse-glow" style={{animationDelay: '0.5s'}}></div>
            <div className="w-2 h-2 bg-white/60 rounded-full pulse-glow" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
        
        <div className="space-y-5 relative z-10 slide-up">
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="w-full bg-white/10 glass-effect text-white py-5 rounded-2xl font-semibold flex items-center justify-center space-x-3 interactive-lift interactive-scale group"
            data-testid="button-login-google"
          >
            <i className="fab fa-google text-xl group-hover:scale-110 transition-transform"></i>
            <span>Continue with Google</span>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/80 glass-effect rounded-full py-1">or</span>
            </div>
          </div>
          
          <div className="relative">
            <input 
              type="tel" 
              placeholder="Enter mobile number" 
              className="w-full p-5 rounded-2xl border-0 bg-white/10 glass-effect placeholder-white/70 text-white backdrop-blur-sm focus:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white/30"
              data-testid="input-mobile"
            />
            <i className="fas fa-phone absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60"></i>
          </div>
          
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="w-full bg-white/10 glass-effect text-white py-5 rounded-2xl font-semibold border border-white/20 hover:bg-white/20 interactive-lift interactive-scale group"
            data-testid="button-login-mobile"
          >
            <span>Get OTP</span>
            <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
          </Button>
        </div>
        
        <p className="text-white/70 text-sm text-center mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
