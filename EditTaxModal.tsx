import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tax } from "@/types/tax";
import { countryApi } from "@/services/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface EditTaxModalProps {
  tax: Tax;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, data: Partial<Tax>) => Promise<void>;
}

export const EditTaxModal = ({
  tax,
  open,
  onClose,
  onSave,
}: EditTaxModalProps) => {
  const [name, setName] = useState(tax.name);
  const [country, setCountry] = useState(tax.country);
  const [saving, setSaving] = useState(false);

  const { data: countries, isLoading: loadingCountries } = useQuery({
    queryKey: ["countries"],
    queryFn: countryApi.getCountries,
  });

  useEffect(() => {
    setName(tax.name);
    setCountry(tax.country);
  }, [tax]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter a tax name");
      return;
    }

    if (!country) {
      toast.error("Please select a country");
      return;
    }

    setSaving(true);
    try {
      await onSave(tax.id, { name, country });
      toast.success("Tax updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update tax");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Tax</DialogTitle>
          <DialogDescription>
            Update the tax details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Tax Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter tax name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="country">Country</Label>
            {loadingCountries ? (
              <div className="flex items-center justify-center h-10 border rounded-md">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries?.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
