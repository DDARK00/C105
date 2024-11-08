import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { TextPlugin } from "gsap/TextPlugin";
gsap.registerPlugin(CustomEase, TextPlugin);

const AIType = () => {
  // Refs for elements
  const typewriterTextRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    // Array of phrases
    const phrases = ["AI기반 기획서 작성", "손쉽게 기획서 작성 가능 !!"];

    // Cursor animation
    const cursor = gsap.to(cursorRef.current, {
      opacity: 0,
      ease: CustomEase.create(
        "custom",
        "M0,0 C0,0 0.184,0 0.5,0 0.5,0 0.5,0.718 0.5,1 0.5,1 1,1 1,1 "
      ),
      repeat: -1,
      duration: 0.5,
      yoyo: true,
    });

    // Typewriter animation
    const masterTl = gsap.timeline({ repeat: -1 });

    phrases.forEach((phrase) => {
      const tl = gsap.timeline({
        repeat: 1,
        yoyo: true,
        repeatDelay: 2,
      });
      tl.to(typewriterTextRef.current, {
        ease: "linear",
        duration: 2.5,
        delay: 0.5,
        text: phrase,
      });
      masterTl.add(tl);
    });

    // Intersection Observer
    const observerOptions = {
      root: null,
      threshold: 0.25,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          masterTl.play();
          cursor.play();
        } else {
          masterTl.pause();
          cursor.pause();
        }
      });
    }, observerOptions);

    if (typewriterTextRef.current) {
      observer.observe(typewriterTextRef.current);
    }

    return () => {
      observer.disconnect();
      masterTl.kill();
      cursor.kill();
    };
  }, []);

  return (
    <div className="flex flex-row items-start">
      <span
        className="flex typewriter-text text-3xl font-bold text-black"
        ref={typewriterTextRef}
        style={{
          display: "inline-block",
          fontFamily: "'Nanum Pen Script', cursive",
        }}
      ></span>
      <span
        className="typewriter-cursor inline-block bg-black w-1 h-8 ml-1"
        ref={cursorRef}
      ></span>
    </div>
  );
};

export default AIType;
