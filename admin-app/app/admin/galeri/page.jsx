"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";

export default function GaleriPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  /* ======================
     CEK LOGIN
  ====================== */
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/admin/login");
      } else {
        setUser(data.user);
      }
    });

    loadGallery();
  }, []);

  /* ======================
     LOGOUT
  ====================== */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  /* ======================
     LOAD GALERI
  ====================== */
  const loadGallery = async () => {
    const { data } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    setImages(data || []);
  };

  /* ======================
     UPLOAD IMAGE
  ====================== */
  const uploadImage = async () => {
    if (!file || !title) {
      alert("Judul dan gambar wajib diisi");
      return;
    }

    setLoading(true);

    const ext = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${ext}`;

    // Upload ke storage
    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(fileName, file);

    if (uploadError) {
      alert(uploadError.message);
      setLoading(false);
      return;
    }

    // Ambil public URL
    const { data: urlData } = supabase.storage
      .from("gallery")
      .getPublicUrl(fileName);

    // Insert ke table
    const { error: insertError } = await supabase
      .from("gallery")
      .insert({
        title,
        image_url: urlData.publicUrl,
      });

    if (insertError) {
      alert(insertError.message);
      setLoading(false);
      return;
    }

    setTitle("");
    setFile(null);
    setLoading(false);
    loadGallery();
  };

  return (
    <div className="space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Galeri</h1>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* ================= UPLOAD ================= */}
      <div className="bg-white p-6 rounded-xl shadow max-w-xl">
        <h2 className="text-lg font-semibold mb-4">Upload Gambar</h2>

        <input
          type="text"
          placeholder="Judul gambar"
          className="border p-2 w-full mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          className="mb-3"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={uploadImage}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* ================= LIST ================= */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Daftar Galeri</h2>

        {images.length === 0 && (
          <p className="text-gray-500">Belum ada gambar</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="bg-white rounded shadow overflow-hidden"
            >
              <img
                src={img.image_url}
                alt={img.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-2 text-sm text-center">
                {img.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
