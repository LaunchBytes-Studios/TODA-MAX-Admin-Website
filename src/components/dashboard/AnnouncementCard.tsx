import { useState } from 'react';
import { DashboardCard } from './DashboardCard';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Megaphone, Send } from 'lucide-react';
import { useFetchAnnouncement } from '@/hooks/announcement/useFetchAnnouncement';
import { useMakeAnnouncement } from '@/hooks/announcement/useMakeAnnouncement';

export const AnnouncementCard = () => {
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  const {
    announcements,
    loading: fetchLoading,
    fetchAnnouncements,
  } = useFetchAnnouncement();

  const { loading: postLoading, postAnnouncement } = useMakeAnnouncement();

  const loading = fetchLoading || postLoading;

  const handleBroadcast = async () => {
    const result = await postAnnouncement(
      message,
      undefined,
      fetchAnnouncements,
    );
    if (result) {
      setMessage('');
    }
  };

  const handleOpenChange = async (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      await fetchAnnouncements();
    }
  };

  return (
    <DashboardCard
      title={
        <span className="flex items-center gap-2 m-0 p-0">
          <Megaphone className="size-5 text-blue-600" />
          Broadcast Alert to All Users
        </span>
      }
      headerActions={
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-blue-600">
              View All
              <ChevronRight className="ml-1 size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>All Announcements</DialogTitle>
              <DialogDescription>
                View all previously broadcasted announcements to users.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <div className="text-gray-500">No announcements found.</div>
              ) : (
                announcements.map((a) => (
                  <div key={a.announce_id} className="border-b pb-2 mb-2">
                    <div className="font-medium">{a.message}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(a.announce_date).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      }
      footer={
        <Button
          onClick={handleBroadcast}
          className="w-full md:w-auto bg-gray-300 hover:bg-gray-400 text-gray-700"
          disabled={!message.trim() || loading}
        >
          <Send className="mr-2 size-4" />
          {loading ? 'Broadcasting...' : 'Broadcast Alert to All Users'}
        </Button>
      }
    >
      <div className="space-y-2">
        <Label htmlFor="alert-message">Alert Message</Label>
        <Textarea
          id="alert-message"
          placeholder="Enter alert message to send to all users..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
        />
      </div>
    </DashboardCard>
  );
};
