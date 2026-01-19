import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { Button } from "../components/ui/button";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <section
      aria-labelledby="landing-heading"
      className="flex min-h-screen items-center justify-center bg-slate-200 px-4 py-12"
    >
      <div className="w-full max-w-2xl rounded-[32px] bg-white px-8 py-12 text-center shadow-xl ring-1 ring-slate-200">
        <img
          alt="Municipality of Pototan TODA MAX"
          className="mx-auto mb-8 h-40 w-40 object-contain"
          src={logo}
        />
        <h1
          id="landing-heading"
          className="text-4xl font-extrabold uppercase tracking-[0.2em] text-slate-800"
        >
          Toda Max
        </h1>
        <p className="mt-6 text-base text-slate-500">
          Empowering Communities, One Healthy Journey at a Time.
        </p>
        <Button
          className="mt-10 inline-flex h-auto items-center gap-3 rounded-full px-10 py-6 text-lg font-semibold bg-[#1447E6] hover:bg-blue-900 text-white"
          onClick={() => navigate("/login")}
        >
          Get Started
          <span aria-hidden="true" className="text-xl leading-none">
            -&gt;
          </span>
        </Button>
      </div>
    </section>
  );
};

export default LandingPage;
