"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { User, Lock, Mail } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get("/api/profile");
        setProfile(res.data);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  async function handleProfileSave() {
    try {
      setSaving(true);
      await axios.patch("/api/profile", profile);
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange() {
    try {
      await axios.patch("/api/profile/change-password", passwords);
      toast.success("Password updated");
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Password change failed"
      );
    }
  }

  if (loading)
    return (
      <div className="px-6 py-10 text-slate-500">
        Loading profile...
      </div>
    );

  return (
    <div className="px-6 sm:px-10 py-10 space-y-10">
 
      <div className="flex items-center gap-3 pt-10">
        <div className="bg-[#009688] text-white p-3 rounded-xl shadow-sm">
          <User size={20} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
            Profile
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your account details and security
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200" />

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 font-medium text-slate-800">
          <Mail size={16} className="text-[#009688]" />
          Account Information
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Name
            </label>
            <input
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-[#009688] focus:ring-1 focus:ring-[#009688]/30 outline-none transition"
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Email
            </label>
            <input
              className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-[#009688] focus:ring-1 focus:ring-[#009688]/30 outline-none transition"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleProfileSave}
            disabled={saving}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-sm font-semibold transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </div>
      </div>

    
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 font-medium text-slate-800">
          <Lock size={16} className="text-[#009688]" />
          Change Password
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="password"
            placeholder="Current Password"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-[#009688] focus:ring-1 focus:ring-[#009688]/30 outline-none"
            value={passwords.currentPassword}
            onChange={(e) =>
              setPasswords({
                ...passwords,
                currentPassword: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="New Password"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:border-[#009688] focus:ring-1 focus:ring-[#009688]/30 outline-none"
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords({
                ...passwords,
                newPassword: e.target.value,
              })
            }
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handlePasswordChange}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-sm font-semibold transition"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
