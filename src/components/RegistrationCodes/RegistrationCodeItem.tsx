import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { RegistrationCodeItemProps } from "@/components/RegistrationCodes/types";

export function RegistrationCodeItem({ code }: RegistrationCodeItemProps) {
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code.code);
    toast.success("Code copied to clipboard!");
  };

  return (
    <tr className="hover:bg-gray-50 border-b group">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <span
              className={
                code.isExpired ? "line-through text-gray-400" : "font-medium"
              }
            >
              {code.code}
            </span>
            {code.isExpired && (
              <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                Expired
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className={`text-sm ${code.isExpired ? "text-gray-400" : ""}`}>
          {code.expiryDate}
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyCode}
          className="h-8 w-8 p-0 hover:bg-gray-100"
          title="Copy code"
        >
          <Copy className="h-4 w-4" />
          <span className="sr-only">Copy code</span>
        </Button>
      </td>
    </tr>
  );
}
