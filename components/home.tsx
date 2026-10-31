"use client";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, A11y, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {
  ArrowUpRight,
  ArrowRight,
  Camera,
  Film,
  Mic,
  Music2,
  Paintbrush,
  ShieldCheck,
  Headphones,
  BadgeCheck,
  Search,
  CalendarDays,
  KeyRound,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";
import { StudioCard, Skeleton, ErrorState, Empty, useResource } from "./shared";
import { type Studio, categories } from "@/lib/types";
const slides = [
  {
    title: (
      <>
        Room for your
        <br />
        next <em>big idea.</em>
      </>
    ),
    text: "From the first spark to the final take. Discover inspiring studios and creative spaces, ready when you are.",
    image: "photo-1497366754035-f200968a6e72",
    label: "SPACE TO CREATE. FREEDOM TO EXPLORE.",
  },
  {
    title: (
      <>
        Find your light.
        <br />
        <em>Make your mark.</em>
      </>
    ),
    text: "Natural light, seamless backdrops, and a fresh perspective. Find the right setting for your next shoot.",
    image: "photo-1497366811353-6870744d04b2",
    label: "A FRESH PERSPECTIVE STARTS HERE.",
  },
  {
    title: (
      <>
        Good ideas
        <br />
        deserve <em>great sound.</em>
      </>
    ),
    text: "Book a focused space for your next recording, podcast conversation, or collaborative session.",
    image: "photo-1598488035139-bdbb2231ce04",
    label: "TURN YOUR NEXT IDEA UP.",
  },
];
const categoryIcons = [Camera, Film, Mic, Music2, Paintbrush];
export function BookingSteps() {
  return (
    <section className="section container" id="how-it-works">
      <div className="center-heading">
        <p className="eyebrow">LESS PLANNING. MORE CREATING.</p>
        <h2>From inspiration to action.</h2>
        <p className="muted">The right space shouldn’t be the hard part.</p>
      </div>
      <div className="steps-grid">
        {[
          [
            Search,
            "Discover spaces",
            "Find the right atmosphere, equipment, and location for your project.",
          ],
          [
            CalendarDays,
            "Select shoot hours",
            "Choose your date and hours with clear, upfront pricing.",
          ],
          [
            KeyRound,
            "Book instantly",
            "Send your reservation request. Your host confirms availability.",
          ],
          [
            Sparkles,
            "Create & produce",
            "Bring your people, your ideas, and your next big thing.",
          ],
        ].map(([Icon, title, text], index) => {
          const Glyph = Icon as typeof Search;
          return (
            <div className="step" key={index}>
              <div className="step-top">
                <Glyph size={24} />
                <span>0{index + 1}</span>
              </div>
              <h3>{title as string}</h3>
              <p>{text as string}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
export default function Home() {
  const { data, loading, error, reload } = useResource<Studio[]>(
    "/studios?featured=true",
  );
  return (
    <>
      <section className="hero">
        <Swiper
          modules={[Autoplay, Pagination, A11y, Keyboard]}
          keyboard={{ enabled: true }}
          autoplay={{
            delay: 6500,
            disableOnInteraction: true,
            pauseOnMouseEnter: true,
          }}
          pagination={{ clickable: true }}
          loop
          className="hero-swiper"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={slide.label}>
              <div
                className="hero-slide"
                style={{
                  backgroundImage: `linear-gradient(90deg,rgba(10,17,15,.82),rgba(10,17,15,.18)),url(https://images.unsplash.com/${slide.image}?auto=format&fit=crop&w=2200&q=85)`,
                }}
              >
                <div className="container hero-content">
                  <p className="eyebrow">
                    <span className="tiny-dot" />
                    {slide.label}
                  </p>
                  <h1>{slide.title}</h1>
                  <p className="hero-copy">{slide.text}</p>
                  <div className="hero-actions">
                    <Button asChild>
                      <Link href="/studios">
                        Explore studios <ArrowUpRight size={18} />
                      </Link>
                    </Button>
                    <Link href="/studios" className="hero-secondary">
                      Host your space <ArrowUpRight size={17} />
                    </Link>
                  </div>
                  <div className="hero-note">
                    <span className="mini-aperture">
                      <Camera size={18} />
                    </span>
                    <div>
                      Spaces for every kind of creator.
                      <small>Photography · Film · Sound · Art</small>
                    </div>
                  </div>
                </div>
                <span className="hero-counter">
                  0{index + 1} <span>/ 03</span>
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      <div className="intro-strip">
        <div className="container">
          <span>BIG IDEAS NEED THE RIGHT SPACE.</span>
          <p>
            Find yours. Make something extraordinary. <ArrowUpRight size={16} />
          </p>
        </div>
      </div>
      <section className="container section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CURATED SPACES. ENDLESS POSSIBILITIES.</p>
            <h2>Your next creative backdrop.</h2>
            <p className="muted">
              Fresh spaces to bring a fresh perspective to your work.
            </p>
          </div>
          <Link href="/studios" className="text-link">
            Explore all studios <ArrowRight size={17} />
          </Link>
        </div>
        {loading ? (
          <Skeleton cards={6} />
        ) : error ? (
          <ErrorState message={error} retry={reload} />
        ) : !data?.length ? (
          <Empty
            title="Be the first to open your doors"
            description="Our studio collection is just getting started. List your space and welcome the next wave of creators."
            href="/add-studio"
            action="List a studio"
          />
        ) : (
          <div className="studio-grid">
            {data.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        )}
      </section>
      <section className="category-section">
        <div className="container section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">FIND YOUR ELEMENT</p>
              <h2>Different spaces. Same creative spirit.</h2>
            </div>
            <p className="muted narrow">
              Whatever you’re making, there’s a space
              <br />
              that feels like it was made for you.
            </p>
          </div>
          <div className="category-grid">
            {categories.map((category, index) => {
              const Icon = categoryIcons[index];
              return (
                <Link
                  href={`/studios?category=${encodeURIComponent(category)}`}
                  key={category}
                  className="category-card"
                >
                  <div>
                    <Icon size={29} strokeWidth={1.4} />
                    <ArrowUpRight size={17} />
                  </div>
                  <h3>{category}</h3>
                  <p>
                    {
                      [
                        "Chase the perfect light.",
                        "Set the scene.",
                        "Start the conversation.",
                        "Find your next sound.",
                        "Get your hands into it.",
                      ][index]
                    }
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <BookingSteps />
      <section className="container support-section">
        <div className="support-image">
          <Image
            unoptimized
            width={1200}
            height={800}
            src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1100&q=80"
            alt="Bright creative workspace with comfortable seating and shared tables"
            loading="lazy"
          />
          <span>
            GOOD SPACES.
            <br />
            GREAT PEACE OF MIND.
          </span>
        </div>
        <div className="support-content">
          <p className="eyebrow">WE’RE IN YOUR CORNER</p>
          <h2>Create with confidence.</h2>
          <p className="muted">
            A little reassurance goes a long way. Here’s how hosts and creators
            can work together with clarity.
          </p>
          {[
            [
              ShieldCheck,
              "Clear protection expectations",
              "Discuss liability cover and deposits with your host before your session.",
            ],
            [
              BadgeCheck,
              "Profiles with a personal touch",
              "See who’s hosting and keep your booking connected to your account.",
            ],
            [
              Camera,
              "Respect for every piece of gear",
              "Check included amenities and agree equipment handling before you arrive.",
            ],
            [
              Headphones,
              "Support for every session",
              "Your booking keeps host details together. Round-the-clock platform support is planned.",
            ],
          ].map(([Icon, title, text], index) => {
            const Glyph = Icon as typeof ShieldCheck;
            return (
              <div className="assurance" key={index}>
                <Glyph size={22} />
                <div>
                  <h3>{title as string}</h3>
                  <p>{text as string}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section className="container host-cta">
        <div>
          <p className="eyebrow">YOUR SPACE. SOMEONE’S NEXT BIG THING.</p>
          <h2>Great space? Share the possibilities.</h2>
          <p>
            Turn your studio’s free hours into someone else’s creative
            breakthrough.
          </p>
        </div>
        <Button asChild>
          <Link href="/add-studio">
            Become a host <ArrowUpRight size={18} />
          </Link>
        </Button>
      </section>
    </>
  );
}
