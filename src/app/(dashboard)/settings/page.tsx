'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile',  },
    { id: 'notifications', label: 'Notifications',},
    { id: 'security', label: 'Security', },
    { id: 'appearance', label: 'Appearance',  },
  ];

  return (
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fadeInDown">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-foreground/70 mt-2">Manage your account preferences and settings.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border overflow-x-auto animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-foreground/70 hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <Card className="p-6 border border-border/50 space-y-6 animate-scaleIn" style={{ animationDelay: '0.2s' }}>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <Input defaultValue="John Doe" className="bg-muted/50 border-border/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <Input type="email" defaultValue="john@credflow.com" className="bg-muted/50 border-border/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                  <Input defaultValue="+234 801 234 5678" className="bg-muted/50 border-border/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Business Name</label>
                  <Input defaultValue="CredFlow Enterprise" className="bg-muted/50 border-border/50" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-4">Account Information</h3>
              <div className="space-y-2 text-sm text-foreground/70">
                <p>Account Type: <span className="font-semibold text-foreground">Premium</span></p>
                <p>Plan: <span className="font-semibold text-foreground">Professional Monthly</span></p>
                <p>Joined: <span className="font-semibold text-foreground">January 15, 2025</span></p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </Card>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <Card className="p-6 border border-border/50 space-y-6 animate-scaleIn" style={{ animationDelay: '0.2s' }}>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Email Notifications</h3>
              <div className="space-y-4">
                {['Overdue debts alerts', 'Payment confirmations', 'Weekly reports', 'New customer added', 'System updates'].map((notification, index) => (
                  <label key={index} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/50 transition">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded" />
                    <span className="text-foreground">{notification}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-4">In-App Notifications</h3>
              <div className="space-y-4">
                {['Overdue reminders', 'Payment milestones', 'Risk alerts', 'Report ready'].map((notification, index) => (
                  <label key={index} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/50 transition">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded" />
                    <span className="text-foreground">{notification}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </Card>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <Card className="p-6 border border-border/50 space-y-6 animate-scaleIn" style={{ animationDelay: '0.2s' }}>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
                  <Input type="password" className="bg-muted/50 border-border/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
                  <Input type="password" className="bg-muted/50 border-border/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                  <Input type="password" className="bg-muted/50 border-border/50" />
                </div>
              </div>
              <Button className="mt-4 bg-purple-600 hover:bg-purple-700">Update Password</Button>
            </div>

            <div className="pt-6 border-t border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-4">Two-Factor Authentication</h3>
              <p className="text-sm text-foreground/70 mb-4">Add an extra layer of security to your account.</p>
              <Button variant="outline">Enable 2FA</Button>
            </div>

            <div className="pt-6 border-t border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-4">Active Sessions</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-border/50">
                  <p className="font-medium text-foreground">Chrome on macOS</p>
                  <p className="text-sm text-foreground/70">Last active: 2 minutes ago</p>
                </div>
                <div className="p-3 rounded-lg border border-border/50">
                  <p className="font-medium text-foreground">Safari on iPhone</p>
                  <p className="text-sm text-foreground/70">Last active: 1 hour ago</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Appearance Settings */}
        {activeTab === 'appearance' && (
          <Card className="p-6 border border-border/50 space-y-6 animate-scaleIn" style={{ animationDelay: '0.2s' }}>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Theme</h3>
              <div className="space-y-3">
                {['Light', 'Dark', 'Auto'].map((theme, index) => (
                  <label key={index} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/50 transition">
                    <input type="radio" name="theme" defaultChecked={index === 0} className="w-4 h-4 text-purple-600" />
                    <span className="text-foreground">{theme}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-4">Display Options</h3>
              <div className="space-y-3">
                {['Compact sidebar', 'Show animations', 'Color blind mode'].map((option, index) => (
                  <label key={index} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/50 transition">
                    <input type="checkbox" defaultChecked={index < 2} className="w-4 h-4 text-purple-600 rounded" />
                    <span className="text-foreground">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </Card>
        )}
      </div>
  );
}
