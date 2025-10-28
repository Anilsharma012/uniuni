import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

type Coupon = {
  code: string;
  discount: number;
  expiryDate: string;
};

type Props = {
  onUseNow?: (code: string) => void;
};

export const AvailableCoupons: React.FC<Props> = ({ onUseNow }) => {
  const { toast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const { ok, json } = await api('/api/coupons/active');
        if (ok && Array.isArray(json?.data)) {
          setCoupons(json.data);
        }
      } catch (error) {
        console.error('Failed to fetch coupons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const handleUseNow = (code: string) => {
    if (onUseNow) {
      onUseNow(code);
      toast({ title: `Coupon ${code} copied to clipboard!` });
    }
  };

  if (loading || coupons.length === 0) {
    return null;
  }

  return (
    <div className="my-8 p-3 rounded-lg border border-gray-200 bg-[#f9fafb]">
      {/* Mobile collapsible header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="md:hidden w-full flex items-center justify-between"
      >
        <h3 className="font-semibold text-sm">{expanded ? 'Hide' : 'Show'} Coupons</h3>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {/* Desktop or expanded mobile */}
      {expanded && (
        <div className="mt-3 md:mt-0">
          <h3 className="hidden md:block font-semibold text-sm mb-3">Available Coupons</h3>
          <div className="space-y-2">
            {coupons.map((coupon) => (
              <div
                key={coupon.code}
                className="flex items-center justify-between p-2 rounded bg-white border border-gray-100"
              >
                <div>
                  <p className="font-bold text-sm">{coupon.code}</p>
                  <p className="text-xs text-gray-600">{coupon.discount}% off</p>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleUseNow(coupon.code)}
                  className="text-xs"
                >
                  Use Now
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
