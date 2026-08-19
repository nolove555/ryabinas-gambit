// src/pages/AddPlayer.tsx — full replace
import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { usePlayers } from "../hooks/usePlayers";

function AddPlayer() {
  const navigate = useNavigate();
  const { addPlayer } = usePlayers();

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("");
  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    setSaving(true);
    try {
      await addPlayer({
        name: name.trim(),
        title: title.trim() || undefined,
        country: country.trim() || undefined,
        rating: rating.trim() || undefined,
        description: description.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
      });
      navigate("/");
    } catch (error) {
      console.error("Failed to add player:", error);
      setError("Could not save the player. Check the server is running.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080a09] px-6 py-12 md:px-10">
      <header className="border-b border-[#2b2117] pb-8">
        <Link to="/" className="inline-flex items-center gap-2 font-serif text-sm text-[#806c4e] transition-colors hover:text-[#d4c4a6]">
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <p className="mt-8 font-serif text-xs tracking-[0.25em] text-[#806c4e]">NEW GRANDMASTER</p>

        <h1 className="mt-3 font-serif text-4xl text-[#d9c8aa] md:text-5xl">Add Grandmaster</h1>

        <p className="mt-4 max-w-2xl font-serif text-base leading-relaxed text-[#8e806b]">
          Add a player to the archive. Only the name is required.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mt-10 max-w-2xl space-y-6">
        <Field label="Name" value={name} onChange={setName} placeholder="Mikhail Tal" />
        <Field label="Title (optional)" value={title} onChange={setTitle} placeholder="Grandmaster" />
        <Field label="Country (optional)" value={country} onChange={setCountry} placeholder="Latvia" />
        <Field label="Rating (optional)" value={rating} onChange={setRating} placeholder="2705" />
        <Field label="Image URL (optional)" value={imageUrl} onChange={setImageUrl} placeholder="https://..." />

        <div>
          <label className="font-serif text-sm text-[#cdbd9f]">Description (optional)</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="A short bio or style summary."
            className="mt-2 min-h-[140px] w-full resize-y rounded-lg border border-[#352819] bg-[#080a09] p-4 font-serif text-sm text-[#d4c4a6] outline-none placeholder:text-[#51493e] focus:border-[#80602f]"
          />
        </div>

        {error && (
          <div className="rounded-lg border border-[#633025] bg-[#21100d] px-4 py-3 text-sm text-[#d75a45]">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#a72c20] px-6 py-3 font-serif text-sm text-[#f0d8b0] transition-colors hover:bg-[#c13a2b] disabled:opacity-50"
          >
            <Save size={17} />
            {saving ? "Saving..." : "Save Grandmaster"}
          </button>

          <Link to="/" className="rounded-lg border border-[#49351f] px-6 py-3 font-serif text-sm text-[#cdbd9f] transition-colors hover:bg-[#17130f]">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

type FieldProps = { label: string; value: string; onChange: (value: string) => void; placeholder: string };

function Field({ label, value, onChange, placeholder }: FieldProps) {
  return (
    <div>
      <label className="font-serif text-sm text-[#cdbd9f]">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-[#352819] bg-[#080a09] px-4 py-3 font-serif text-sm text-[#d4c4a6] outline-none placeholder:text-[#51493e] focus:border-[#80602f]"
      />
    </div>
  );
}

export default AddPlayer;