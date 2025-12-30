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

      <section className="relative bg-[#000000] w-full h-screen mx-auto overflow-hidden">
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

        <div className="h-full w-full relative flex flex-col justify-center max-w-7xl mx-auto">
          {/* Content Container */}
          <div className="relative z-10 flex flex-col items-center sm:items-start mt-36 sm:mt-0 sm:justify-center h-full w-full px-6 sm:px-8 gap-1">
            {/* Main Title */}
            <img
              src="/images/v9/two-sleepy-people-logo.svg"
              alt="Two Sleepy People"
              className="w-[500px] object-left sm:block hidden"
            />

            <img
              src="/images/v9/two-sleepy-people-logo-centered.svg"
              alt="Two Sleepy People"
              className="w-[300px] object-left sm:hidden block"
            />

            <div className="flex flex-col gap-6 items-center sm:items-start">
              {/* Subtitle */}
              <p className="text-white text-xl sm:text-[38px] uppercase tracking-wide sm:tracking-tighter font-light">
                In Theaters January 23rd
              </p>

              {/* Buttons */}
              <div className="flex flex-col gap-4 w-full">
                <a
                  href="https://tickets.twosleepypeople.com/"
                  className="w-full sm:w-auto"
                >
                  <button className="w-full px-8 py-3 md:px-10 bg-[#EC407A] hover:bg-[#D81B60] text-white border border-white font-semibold uppercase rounded-full transition-colors duration-200 text-sm md:text-base">
                    Buy Tickets
                  </button>
                </a>
                <button
                  onClick={handleOpenModal}
                  className="w-full px-8 py-3 md:px-10 bg-transparent border-2 border-black bg-white text-black hover:bg-white hover:text-black font-semibold uppercase rounded-full transition-colors duration-200 text-sm md:text-base"
                >
                  Get Your Name in the Credits
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
