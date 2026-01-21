import { useState } from "react";
import CreditsModal from "../CreditsModal";
import { useSubmitSignup } from "../../hooks/useSubmitSignup";

export default function Hero({ onOpenCreditsModal }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { submit, loading } = useSubmitSignup();

  const handleOpenModal = () => {
    if (onOpenCreditsModal) {
      // If parent provides a handler, use it (for FanDemandGlobe integration)
      onOpenCreditsModal();
    } else {
      // Otherwise, manage modal state locally (for standalone use)
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Real submit handler for standalone Hero usage
  const handleSubmit = async (formData) => {
    try {
      const result = await submit(formData);
      return { success: true, submission: result?.submission || result };
    } catch (err) {
      return { success: false, error: err?.message || "Submission failed" };
    }
  };

  return (
    <>
      {/* Only render modal if not using parent's modal (standalone mode) */}
      {!onOpenCreditsModal && (
        <CreditsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          loading={loading}
        />
      )}

      <section className="relative bg-[#000000] flex flex-col justify-center items-center w-full h-screen mx-auto overflow-hidden">
        <div className="absolute hidden sm:block inset-0 bg-gradient-to-t from-black to-transparent z-10" />

        <div className="absolute sm:hidden w-full left-0 bottom-0 h-[140px] sm:h-[170px] bg-gradient-to-t from-black to-transparent z-10" />

        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/images/v9/hero-image.png"
            alt="Two Sleepy People"
            className="absolute inset-0 w-full h-full object-left object-cover z-0"
          />
        </div>

        <div className="absolute bottom-0 w-full sm:hidden">
          <img
            src="/images/v9/hero-image.png"
            alt="Two Sleepy People"
            className="h-80 w-full object-bottom object-cover"
          />
        </div>

        <div className="h-full w-full relative flex flex-col justify-center mx-auto">
          {/* Content Container */}
          <div className="relative z-10 flex flex-col items-center sm:items-start mt-36 sm:mt-0 sm:justify-center h-full w-full px-6 sm:px-8">
            {/* Content Wrapper - consistent width for all elements */}
            <div className="w-full max-w-md sm:max-w-lg sm:items-center items-center flex flex-col gap-1">
              {/* Main Title */}
              <img
                src="/images/v10/hero-logo-2.svg"
                alt="Two Sleepy People"
                className="h-auto w-[150px] sm:max-w-[225px] mb-8"
              />

              <h1
                className="text-3xl sm:text-5xl text-white text-center sm:text-left font-bold mb-4 uppercase tracking-normal sm:tracking-tight"
                style={{
                  fontFamily: "'Grotesk Bold', serif",
                  fontWeight: 700,
                  lineHeight: "106%",
                  letterSpacing: "-1%",
                }}
              >
                Indie film isn't dead.
                <br />
                <span
                  className="normal-case text-left italic text-[26px] sm:text-[44px]"
                  style={{
                    fontFamily: "'Adobe Garamond Pro', serif",
                    fontWeight: 700,
                    lineHeight: "106%",
                    letterSpacing: "-1%",
                  }}
                >
                  This Movie’s Trying To Save it.
                </span>
              </h1>

              <div className="flex flex-col gap-8 sm:gap-14 items-center sm:items-start">
                {/* Subtitle */}
                <p className="text-white text-[14px] sm:text-[24px] uppercase tracking-wider sm:tracking-[0.4rem] font-light">
                  In Theaters January 23rd
                </p>

                {/* Buttons */}
                <div className="flex flex-col w-full">
                  <a
                    href="https://tickets.twosleepypeople.com/"
                    className="w-full sm:w-auto"
                  >
                    <button className="w-full px-8 py-2 md:px-10 bg-[#EC407A] hover:bg-[#D81B60] text-white border border-white font-semibold uppercase rounded-full transition-colors duration-200 text-sm md:text-base">
                      Buy Tickets
                    </button>
                  </a>
                  <a href="https://thebreakupmovie.com/">
                    <button className="w-full block sm:hidden mt-4 px-8 py-1.5 md:px-10 bg-transparent border-2 border-black bg-white text-black hover:bg-white hover:text-black font-semibold uppercase rounded-full transition-colors duration-200 text-sm">
                      TAKE THE RELATIONSHIP QUIZ
                    </button>
                  </a>
                  <a href="https://thebreakupmovie.com/">
                    <button className="w-full hidden sm:block mt-4 px-8 py-1.5 md:px-10 bg-transparent border-2 border-black bg-white text-black hover:bg-white hover:text-black font-semibold uppercase rounded-full transition-colors duration-200 text-sm">
                      TAKE THE RELATIONSHIP QUIZ (3 Mins)
                    </button>
                  </a>
                </div>
              </div>
              {/* End Content Wrapper */}
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 mx-auto z-40 block sm:hidden">
          <img
            src="/images/v10/mobile-labels.svg"
            alt="Two Sleepy People"
            className="object-cover z-0 w-full h-auto max-w-sm"
          />
        </div>
      </section>
    </>
  );
}
