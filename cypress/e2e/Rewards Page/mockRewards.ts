export interface Reward {
  id: number;
  rewardName: string;
  description?: string;
  category: string;
  pointsCost: number;
  stockAvailable: number;
  lowStockThreshold: number;
  isActive: boolean;
  totalRedeemed: number;
  code: string;
}

export const mockRewards: Reward[] = [
  {
    id: 1,
    rewardName: 'P50 Medication Discount',
    description: '50 pesos off medication',
    category: 'Discount',
    pointsCost: 50,
    stockAvailable: 10,
    lowStockThreshold: 2,
    isActive: true,
    totalRedeemed: 5,
    code: 'P50-001',
  },
  {
    id: 2,
    rewardName: 'Free Delivery Voucher',
    description: 'Waives delivery fee',
    category: 'Voucher',
    pointsCost: 30,
    stockAvailable: 0,
    lowStockThreshold: 1,
    isActive: true,
    totalRedeemed: 12,
    code: 'FD-002',
  },
  {
    id: 3,
    rewardName: 'P100 Medication Discount',
    description: '100 pesos off',
    category: 'Discount',
    pointsCost: 100,
    stockAvailable: 3,
    lowStockThreshold: 2,
    isActive: false,
    totalRedeemed: 0,
    code: 'P100-003',
  },
  {
    id: 4,
    rewardName: 'Free Consultation',
    description: 'One free consult',
    category: 'Service',
    pointsCost: 200,
    stockAvailable: 5,
    lowStockThreshold: 1,
    isActive: true,
    totalRedeemed: 2,
    code: 'CONS-004',
  },
  {
    id: 5,
    rewardName: 'Sample Pack',
    description: 'Trial sample pack',
    category: 'Sample',
    pointsCost: 10,
    stockAvailable: 50,
    lowStockThreshold: 10,
    isActive: true,
    totalRedeemed: 30,
    code: 'SAMP-005',
  },
];

export const mockStats = {
  total: mockRewards.length,
  active: mockRewards.filter((r) => r.isActive).length,
  lowStock: mockRewards.filter(
    (r) => r.stockAvailable > 0 && r.stockAvailable <= r.lowStockThreshold,
  ).length,
};

export function getMockResponse(url: string) {
  const parsed = new URL(url);
  const search = parsed.searchParams.get('search') ?? '';
  const category = parsed.searchParams.get('category') ?? '';
  const limit = parseInt(parsed.searchParams.get('limit') ?? '10', 10);
  const offset = parseInt(parsed.searchParams.get('offset') ?? '0', 10);

  let filtered = [...mockRewards];

  if (category) {
    filtered = filtered.filter(
      (r) => r.category.toLowerCase() === category.toLowerCase(),
    );
  }

  if (search) {
    const lower = search.toLowerCase();
    filtered = filtered.filter((r) =>
      r.rewardName.toLowerCase().includes(lower),
    );
  }

  const paginated = filtered.slice(offset, offset + limit);

  // Map frontend mock to backend shape expected by the app
  const backendData = paginated.map((r) => ({
    reward_id: r.id,
    name: r.rewardName,
    description: r.description,
    category: r.category,
    points_required: r.pointsCost,
    stock_available: r.stockAvailable,
    low_stock_threshold: r.lowStockThreshold,
    total_redeemed: r.totalRedeemed,
    reward_code: r.code,
    is_active: r.isActive,
  }));

  return {
    success: true,
    message: '',
    data: backendData,
    meta: {
      total: filtered.length,
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(filtered.length / limit) || 1,
    },
  };
}
