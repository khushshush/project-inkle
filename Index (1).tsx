import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TaxTable } from "@/components/TaxTable";
import { taxApi } from "@/services/api";
import { Tax } from "@/types/tax";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const queryClient = useQueryClient();

  const { data: taxes, isLoading, error } = useQuery({
    queryKey: ["taxes"],
    queryFn: taxApi.getTaxes,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Tax> }) =>
      taxApi.updateTax(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["taxes"] });
    },
  });

  const handleUpdate = async (id: string, data: Partial<Tax>) => {
    await updateMutation.mutateAsync({ id, data });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Error</h2>
          <p className="text-muted-foreground">Failed to load tax data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Tax Management
          </h1>
          <p className="text-muted-foreground">
            View and manage tax information across different countries
          </p>
        </header>

        {taxes && <TaxTable data={taxes} onUpdate={handleUpdate} />}
      </div>
    </div>
  );
};

export default Index;
