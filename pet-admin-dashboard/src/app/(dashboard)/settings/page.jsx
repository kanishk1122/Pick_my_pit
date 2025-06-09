"use client";
import { useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [siteSettings, setSiteSettings] = useState({
    siteName: "Pet Admin Dashboard",
    maintenanceMode: false,
    contactEmail: "admin@example.com",
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // In a real app, you would update the profile via API
    setTimeout(() => {
      setLoading(false);
      // Show success message
    }, 1000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // In a real app, you would update the password via API
    setTimeout(() => {
      setLoading(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      // Show success message
    }, 1000);
  };

  const handleSiteSettingsSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // In a real app, you would update site settings via API
    setTimeout(() => {
      setLoading(false);
      // Show success message
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      <TabView
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        <TabPanel header="Profile">
          <Card className="bg-zinc-800/50 shadow">
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-white">
                    Full Name
                  </label>
                  <InputText
                    id="name"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, name: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-white">
                    Email Address
                  </label>
                  <InputText
                    id="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                    disabled
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-white">
                    Phone Number
                  </label>
                  <InputText
                    id="phone"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, phone: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label htmlFor="bio" className="text-white">
                    Bio
                  </label>
                  <InputTextarea
                    id="bio"
                    value={profileForm.bio}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, bio: e.target.value })
                    }
                    rows={5}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  label="Save Changes"
                  icon="pi pi-save"
                  loading={loading}
                  type="submit"
                />
              </div>
            </form>
          </Card>
        </TabPanel>

        <TabPanel header="Password">
          <Card className="bg-zinc-800/50 shadow">
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="currentPassword" className="text-white">
                  Current Password
                </label>
                <InputText
                  id="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="newPassword" className="text-white">
                  New Password
                </label>
                <InputText
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="confirmPassword" className="text-white">
                  Confirm Password
                </label>
                <InputText
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button
                  label="Update Password"
                  icon="pi pi-lock"
                  loading={loading}
                  type="submit"
                />
              </div>
            </form>
          </Card>
        </TabPanel>

        <TabPanel header="Site Settings">
          <Card className="bg-zinc-800/50 shadow">
            <form onSubmit={handleSiteSettingsSubmit} className="space-y-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="siteName" className="text-white">
                  Site Name
                </label>
                <InputText
                  id="siteName"
                  value={siteSettings.siteName}
                  onChange={(e) =>
                    setSiteSettings({
                      ...siteSettings,
                      siteName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="maintenanceMode" className="text-white">
                  Maintenance Mode
                </label>
                <select
                  id="maintenanceMode"
                  className="p-inputtext p-component rounded"
                  value={siteSettings.maintenanceMode ? "on" : "off"}
                  onChange={(e) =>
                    setSiteSettings({
                      ...siteSettings,
                      maintenanceMode: e.target.value === "on",
                    })
                  }
                >
                  <option value="off">Off</option>
                  <option value="on">On</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="contactEmail" className="text-white">
                  Contact Email
                </label>
                <InputText
                  id="contactEmail"
                  value={siteSettings.contactEmail}
                  onChange={(e) =>
                    setSiteSettings({
                      ...siteSettings,
                      contactEmail: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-end">
                <Button
                  label="Save Site Settings"
                  icon="pi pi-save"
                  loading={loading}
                  type="submit"
                />
              </div>
            </form>
          </Card>
        </TabPanel>
      </TabView>
    </div>
  );
}
