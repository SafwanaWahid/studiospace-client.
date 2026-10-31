"use client";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Upload, Save } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { api, errorMessage } from "@/lib/api";
import { categories, type Studio } from "@/lib/types";
import { Heading, Private, useResource, Skeleton, ErrorState } from "./shared";
import { Button } from "./ui/button";
const amenities = [
  "Natural light",
  "Wi-Fi",
  "Air conditioning",
  "Lighting equipment",
  "Seamless backdrop",
  "Soundproofing",
  "Microphones",
  "Changing room",
  "Parking",
  "Kitchen",
  "Restroom",
  "Power outlets",
];
function Editor({ studio }: { studio?: Studio }) {
  const { data } = authClient.useSession();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState(studio?.images.join("\n") || "");
  const [error, setError] = useState("");
  async function upload(file?: File) {
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      toast.error("Choose a JPG, PNG, or WebP image smaller than 5 MB.");
      return;
    }
    setUploading(true);
    try {
      const encoded = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const result = await api<{ url: string }>("/upload", {
        method: "POST",
        body: JSON.stringify({ image: encoded }),
      });
      setImages((current) => [current, result.url].filter(Boolean).join("\n"));
      toast.success("Image uploaded.");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setUploading(false);
    }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      title: form.get("title"),
      category: form.get("category"),
      hourlyRate: Number(form.get("hourlyRate")),
      deposit: Number(form.get("deposit")),
      capacity: Number(form.get("capacity")),
      location: form.get("location"),
      overview: form.get("overview"),
      amenities: form.getAll("amenities"),
      images: images
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
    };
    setBusy(true);
    setError("");
    try {
      await api(studio ? `/studios/${studio._id}` : "/studios", {
        method: studio ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      toast.success(
        studio
          ? "Your studio is updated."
          : "Your studio is ready for creators.",
      );
      router.push("/my-listings");
    } catch (err) {
      setError(errorMessage(err));
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="container section form-page">
      <Heading
        eyebrow="OPEN YOUR DOORS TO POSSIBILITY"
        title={
          studio ? "Fine-tune your space." : "Your space. Their next big idea."
        }
        description="Give creators a clear picture of what makes your studio special."
      />
      <form className="editor-form" onSubmit={submit}>
        <div className="panel">
          <h2>The essentials</h2>
          <div className="form-grid">
            <label className="full">
              Studio title
              <input
                name="title"
                defaultValue={studio?.title}
                required
                minLength={3}
                maxLength={120}
                placeholder="e.g. Daylight Loft — Natural Light Photo Studio"
              />
            </label>
            <label>
              Studio category
              <select
                name="category"
                defaultValue={studio?.category || ""}
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              Maximum capacity
              <input
                name="capacity"
                type="number"
                min="1"
                max="1000"
                step="1"
                defaultValue={studio?.capacity || 1}
                required
              />
            </label>
            <label>
              Hourly rate ($)
              <input
                name="hourlyRate"
                type="number"
                min="1"
                max="100000"
                step="0.01"
                defaultValue={studio?.hourlyRate}
                required
                placeholder="75"
              />
            </label>
            <label>
              Security deposit ($)
              <input
                name="deposit"
                type="number"
                min="0"
                max="100000"
                step="0.01"
                defaultValue={studio?.deposit ?? 0}
                required
              />
            </label>
            <label className="full">
              Location / address
              <input
                name="location"
                defaultValue={studio?.location}
                minLength={3}
                maxLength={200}
                required
                placeholder="Neighborhood, city, and address"
              />
            </label>
          </div>
        </div>
        <div className="panel">
          <h2>Let your space do the talking</h2>
          <p className="muted">
            Upload images or add direct image URLs. The first image becomes your
            cover.
          </p>
          <label className="upload-box">
            <Upload size={25} />
            <strong>
              {uploading ? "Uploading your image…" : "Choose a studio photo"}
            </strong>
            <span>JPG, PNG, or WebP · Up to 5 MB</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={uploading}
              onChange={(e) => {
                void upload(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
          <label>
            Image URLs — one per line, up to 8
            <textarea
              value={images}
              onChange={(e) => setImages(e.target.value)}
              required
              rows={3}
              placeholder="https://example.com/studio.jpg"
            />
          </label>
          {images && (
            <div className="image-previews">
              {images
                .split("\n")
                .filter(Boolean)
                .slice(0, 8)
                .map((url, i) => (
                  <Image
                    unoptimized
                    width={1200}
                    height={800}
                    key={`${url}-${i}`}
                    src={url.trim()}
                    alt={`Studio preview ${i + 1}`}
                  />
                ))}
            </div>
          )}
        </div>
        <div className="panel">
          <h2>The details that make a difference</h2>
          <label>
            Detailed overview
            <textarea
              name="overview"
              rows={6}
              required
              minLength={30}
              maxLength={6000}
              defaultValue={studio?.overview}
              placeholder="Describe the atmosphere, equipment, access, and any house rules creators should know."
            />
          </label>
          <h3 className="field-heading">Amenities included</h3>
          <div className="amenity-options">
            {[...new Set([...amenities, ...(studio?.amenities || [])])].map(
              (item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    name="amenities"
                    value={item}
                    defaultChecked={studio?.amenities.includes(item)}
                  />
                  {item}
                </label>
              ),
            )}
          </div>
        </div>
        <div className="panel">
          <h2>Your host profile</h2>
          <div className="form-grid">
            <label>
              Host name
              <input readOnly value={data?.user.name || ""} />
            </label>
            <label>
              Host email
              <input readOnly value={data?.user.email || ""} />
            </label>
          </div>
          <small>
            Your account details identify you as the owner of this listing.
          </small>
        </div>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="form-actions">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/my-listings")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={busy || uploading}>
            <Save size={17} />
            {busy ? "Saving…" : studio ? "Save changes" : "Publish your studio"}
          </Button>
        </div>
      </form>
    </section>
  );
}
function EditLoader({ id }: { id: string }) {
  const { data, loading, error, reload } = useResource<Studio>(
    `/studios/${id}`,
  );
  const { data: session } = authClient.useSession();
  if (loading)
    return (
      <div className="container section">
        <Skeleton />
      </div>
    );
  if (error || !data)
    return <ErrorState message={error || "Studio not found."} retry={reload} />;
  if (data.ownerEmail !== session?.user.email)
    return <ErrorState message="Only the owner can edit this studio." />;
  return <Editor studio={data} />;
}
export default function StudioForm({ id }: { id?: string }) {
  return <Private>{id ? <EditLoader id={id} /> : <Editor />}</Private>;
}
