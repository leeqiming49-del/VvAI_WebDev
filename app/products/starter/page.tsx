"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  Brain,
  ChevronDown,
  CircleDollarSign,
  ListTree,
  Plus,
  ReceiptText,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VvaiProductShell } from "@/components/vvai-product-shell";

type SalesCategory = { id: string; name: string; revenue: string; cost: string };
type ExpenseItem = { id: string; name: string; amount: string };
type CostMode = "rm" | "percent";
type Insight = { title: string; detail: string; action: string };
type CategoryRow = SalesCategory & { revenueValue: number; costValue: number; grossProfit: number; margin: number };
type ValidationWarning = { message: string } | null;

const numberInputClass = "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

const starterCategories: SalesCategory[] = [
  { id: "food", name: "Food", revenue: "50000", cost: "35000" },
  { id: "beverage", name: "Beverage", revenue: "12000", cost: "4200" },
  { id: "beer", name: "Beer", revenue: "10000", cost: "2000" },
];

const starterExpenses: ExpenseItem[] = [
  { id: "salary", name: "Salary", amount: "12000" },
  { id: "rental", name: "Rental", amount: "6000" },
  { id: "marketing", name: "Marketing", amount: "2500" },
  { id: "utilities", name: "Utilities", amount: "1500" },
  { id: "others", name: "Others", amount: "1000" },
];

function formatCurrency(value: number) {
  return `RM${new Intl.NumberFormat("en-MY", { maximumFractionDigits: 2 }).format(value)}`;
}

function toNumber(value: string) {
  return Number(value) || 0;
}

function categoryCost(category: SalesCategory, mode: CostMode) {
  const revenue = toNumber(category.revenue);
  const cost = toNumber(category.cost);
  return mode === "percent" ? revenue * (cost / 100) : cost;
}

function pct(value: number) {
  if (!Number.isFinite(value)) return "0.0%";
  return `${value.toFixed(1)}%`;
}

function variancePercent(actual: number, budget: number) {
  if (!budget) return "0.0%";
  return pct(((actual - budget) / budget) * 100);
}

function statusFor(value: number, type: "profit" | "cost" | "expense" | "margin") {
  if (type === "margin") {
    if (value >= 25) return "Strong";
    if (value >= 10) return "Healthy";
    return "Needs Attention";
  }
  if (type === "profit") {
    if (value > 0) return "Healthy";
    return "Needs Attention";
  }
  if (type === "cost" || type === "expense") {
    if (value <= 35) return "Low";
    if (value <= 60) return "High";
    return "Needs Attention";
  }
  return "Needs Attention";
}

function statusClass(status: string) {
  if (status === "Strong" || status === "Healthy" || status === "Low") return "border-emerald-300/20 bg-emerald-300/10 text-emerald-300";
  if (status === "High") return "border-amber-300/20 bg-amber-300/10 text-amber-200";
  return "border-rose-300/20 bg-rose-400/10 text-rose-200";
}

function buildCategoryRows(categories: SalesCategory[], mode: CostMode): CategoryRow[] {
  return categories.map((category) => {
    const revenueValue = toNumber(category.revenue);
    const costValue = categoryCost(category, mode);
    const grossProfit = revenueValue - costValue;
    const margin = revenueValue > 0 ? (grossProfit / revenueValue) * 100 : 0;
    return { ...category, revenueValue, costValue, grossProfit, margin };
  });
}

function buildInsights(categories: SalesCategory[], expenses: ExpenseItem[], mode: CostMode): Insight[] {
  const rows = categories
    .map((category) => {
      const revenue = toNumber(category.revenue);
      const cost = categoryCost(category, mode);
      const grossProfit = revenue - cost;
      const margin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
      return { ...category, revenue, cost, grossProfit, margin };
    })
    .filter((category) => category.revenue > 0 || category.cost > 0);

  const totalRevenue = rows.reduce((sum, row) => sum + row.revenue, 0);
  const totalCost = rows.reduce((sum, row) => sum + row.cost, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + toNumber(expense.amount), 0);
  const grossProfit = totalRevenue - totalCost;
  const netProfit = grossProfit - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  const insights: Insight[] = [];

  const highestRevenue = [...rows].sort((a, b) => b.revenue - a.revenue)[0];
  const highestMargin = [...rows].sort((a, b) => b.margin - a.margin)[0];
  const lowestMargin = [...rows].sort((a, b) => a.margin - b.margin)[0];
  const biggestExpense = [...expenses].sort((a, b) => toNumber(b.amount) - toNumber(a.amount))[0];

  if (highestMargin && highestMargin.revenue > 0) {
    insights.push({
      title: `${highestMargin.name} has the strongest margin`,
      detail: `${highestMargin.name} contributes ${pct((highestMargin.revenue / Math.max(totalRevenue, 1)) * 100)} of revenue and keeps ${pct(highestMargin.margin)} gross margin.`,
      action: "Protect this category, review whether it can be promoted more, and avoid discounting it too aggressively.",
    });
  }

  if (highestRevenue && totalRevenue > 0 && highestRevenue.revenue / totalRevenue > 0.55) {
    insights.push({
      title: `${highestRevenue.name} creates revenue concentration risk`,
      detail: `${highestRevenue.name} represents ${pct((highestRevenue.revenue / totalRevenue) * 100)} of total revenue, so one category is carrying most sales.`,
      action: "Track this category separately and build a second dependable revenue category to reduce dependency.",
    });
  }

  if (lowestMargin && lowestMargin.revenue > 0 && lowestMargin.margin < 25) {
    insights.push({
      title: `${lowestMargin.name} is weakening gross profit`,
      detail: `${lowestMargin.name} generates ${formatCurrency(lowestMargin.revenue)} revenue but only ${pct(lowestMargin.margin)} gross margin after category cost.`,
      action: "Review pricing, supplier cost, wastage, fulfilment, or packaging for this category first.",
    });
  }

  if (biggestExpense && totalRevenue > 0) {
    const expenseShare = (toNumber(biggestExpense.amount) / totalRevenue) * 100;
    if (expenseShare > 12) {
      insights.push({
        title: `${biggestExpense.name} is the largest operating expense`,
        detail: `${biggestExpense.name} uses ${pct(expenseShare)} of revenue before net profit is calculated.`,
        action: "Set a monthly ceiling for this expense and compare it against revenue movement before increasing spend.",
      });
    }
  }

  if (totalCost > grossProfit && totalRevenue > 0) {
    insights.push({
      title: "COGS is absorbing more value than gross profit",
      detail: `COGS is ${pct((totalCost / totalRevenue) * 100)} of revenue, leaving ${pct((grossProfit / totalRevenue) * 100)} gross margin before expenses.`,
      action: "Focus on category-level cost reduction before adding new marketing or fixed expenses.",
    });
  }

  if (profitMargin < 10 && totalRevenue > 0) {
    insights.push({
      title: "Net profit margin needs attention",
      detail: `After COGS and expenses, the business keeps ${pct(profitMargin)} net profit margin.`,
      action: "Improve one high-cost category and one large operating expense before scaling sales volume.",
    });
  }

  if (insights.length === 0 && totalRevenue > 0) {
    insights.push({
      title: "The current structure looks balanced",
      detail: `Revenue, COGS, and expenses leave ${pct(profitMargin)} net profit margin with no single obvious pressure point.`,
      action: "Keep tracking category margin monthly so changes in cost or sales mix are visible early.",
    });
  }

  return insights.slice(0, 4);
}

function DarkSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value)?.label || value;

  return (
    <div className="relative grid gap-2 text-sm font-semibold text-slate-300">
      <span>{label}</span>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-12 w-full items-center justify-between rounded-lg border border-cyan/15 bg-black/45 px-4 text-left text-sm text-white outline-none transition hover:border-cyan/40 focus:border-cyan/60 focus:ring-2 focus:ring-cyan/10"
      >
        {selected}
        <ChevronDown className={`text-cyan transition ${open ? "rotate-180" : ""}`} size={16} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-[72px] z-20 overflow-hidden rounded-lg border border-cyan/15 bg-[#05090b] p-1 shadow-[0_18px_50px_rgba(0,0,0,.45)]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`block w-full rounded-md px-3 py-2 text-left text-sm transition hover:bg-cyan/10 hover:text-cyan ${value === option.value ? "bg-cyan/10 text-cyan" : "text-slate-300"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StarterDashboardPage() {
  const [period, setPeriod] = useState("Monthly Revenue");
  const [costMode, setCostMode] = useState<CostMode>("rm");
  const [categories, setCategories] = useState<SalesCategory[]>(starterCategories);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(starterExpenses);
  const [budgetEnabled, setBudgetEnabled] = useState(false);
  const [budgetRevenue, setBudgetRevenue] = useState("");
  const [budgetCost, setBudgetCost] = useState("");
  const [budgetOperatingExpenses, setBudgetOperatingExpenses] = useState("");
  const [calculated, setCalculated] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [showAllInsights, setShowAllInsights] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [validationWarning, setValidationWarning] = useState<ValidationWarning>(null);
  const [businessType, setBusinessType] = useState("");
  const [rating, setRating] = useState("");
  const [wouldUseAgain, setWouldUseAgain] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackSaved, setFeedbackSaved] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  const categoryRows = useMemo(() => buildCategoryRows(categories, costMode), [categories, costMode]);

  const totals = useMemo(() => {
    const revenue = categoryRows.reduce((sum, category) => sum + category.revenueValue, 0);
    const cogs = categoryRows.reduce((sum, category) => sum + category.costValue, 0);
    const grossProfit = revenue - cogs;
    const operatingExpenses = expenses.reduce((sum, expense) => sum + toNumber(expense.amount), 0);
    const netProfit = grossProfit - operatingExpenses;
    const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
    return { revenue, cogs, grossProfit, operatingExpenses, netProfit, profitMargin };
  }, [categoryRows, expenses]);

  const breakdown = useMemo(() => {
    const activeRows = categoryRows.filter((category) => category.revenueValue > 0 || category.costValue > 0);
    const topRevenue = [...activeRows].sort((a, b) => b.revenueValue - a.revenueValue)[0];
    const highestMargin = [...activeRows].filter((category) => category.revenueValue > 0).sort((a, b) => b.margin - a.margin)[0];
    const largestCost = [...activeRows].sort((a, b) => b.costValue - a.costValue)[0];
    const largestExpense = [...expenses].sort((a, b) => toNumber(b.amount) - toNumber(a.amount))[0];
    return { topRevenue, highestMargin, largestCost, largestExpense };
  }, [categoryRows, expenses]);

  function updateCategory(id: string, field: keyof Omit<SalesCategory, "id">, value: string) {
    setCategories((items) => items.map((item) => item.id === id ? { ...item, [field]: value } : item));
  }

  function updateExpense(id: string, field: keyof Omit<ExpenseItem, "id">, value: string) {
    setExpenses((items) => items.map((item) => item.id === id ? { ...item, [field]: value } : item));
  }

  async function saveFeedback() {
    setFeedbackError("");
    setFeedbackSaved(false);

    if (!rating || !wouldUseAgain) {
      setFeedbackError("Please add a rating and choose whether you would use this again.");
      return;
    }

    setFeedbackSubmitting(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessType,
          rating,
          wouldUseAgain,
          feedback,
        }),
      });

      if (!response.ok) {
        throw new Error("Feedback could not be saved. Please try again later.");
      }

      setFeedbackSaved(true);
      setFeedback("");
    } catch (error) {
      setFeedbackError(error instanceof Error ? error.message : "Feedback could not be saved. Please try again later.");
    } finally {
      setFeedbackSubmitting(false);
    }
  }

  function handleAnalyze() {
    setValidationError("");
    setValidationWarning(null);

    if (costMode === "percent") {
      const negativeCategory = categories.find((category) => toNumber(category.cost) < 0);
      if (negativeCategory) {
        setValidationError("Percentage values cannot be negative.");
        setCalculated(false);
        return;
      }

      const overLimit = categories.some((category) => toNumber(category.cost) > 100);
      if (overLimit) {
        setValidationWarning({ message: "Cost percentage is over 100%. This may mean the cost is higher than the revenue. Continue?" });
        setCalculated(false);
        return;
      }

      const totalPercentage = categories.reduce((sum, category) => sum + toNumber(category.cost), 0);
      if (totalPercentage > 100) {
        setValidationWarning({ message: "Total percentage exceeds 100%." });
        setCalculated(false);
        return;
      }
    }

    continueAnalysis();
  }

  function continueAnalysis() {
    setValidationError("");
    setValidationWarning(null);
    setCalculated(true);
    setInsights(buildInsights(categories, expenses, costMode));
    setShowAllInsights(false);
    setShowDetails(false);
    setFeedbackSaved(false);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  const kpis = [
    ["Revenue", totals.revenue, totals.revenue > 0 ? "Healthy" : "Needs Attention", CircleDollarSign],
    ["Gross Profit", totals.grossProfit, statusFor(totals.grossProfit, "profit"), TrendingUp],
    ["Net Profit", totals.netProfit, statusFor(totals.netProfit, "profit"), BarChart3],
    ["Profit Margin", totals.profitMargin, statusFor(totals.profitMargin, "margin"), Sparkles],
    ["COGS / Cost", totals.cogs, statusFor(totals.revenue > 0 ? (totals.cogs / totals.revenue) * 100 : 0, "cost"), WalletCards],
    ["Operating Expenses", totals.operatingExpenses, statusFor(totals.revenue > 0 ? (totals.operatingExpenses / totals.revenue) * 100 : 0, "expense"), ReceiptText],
  ] as const;

  const budgetComparisons = [
    ["Revenue vs Target", totals.revenue, toNumber(budgetRevenue)],
    ["Cost vs Target", totals.cogs, toNumber(budgetCost)],
    ["Expenses vs Target", totals.operatingExpenses, toNumber(budgetOperatingExpenses)],
  ] as const;

  const visibleInsights = showAllInsights ? insights : insights.slice(0, 2);

  return <VvaiProductShell>
    <section className={`min-h-screen bg-[#030303] px-4 py-6 text-white sm:px-5 md:py-10 lg:px-8 ${!calculated ? "pb-28 md:pb-12" : ""}`}>
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/products/neural-command" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[.08] bg-black/30 text-slate-400 transition hover:border-cyan/30 hover:text-cyan" aria-label="Back to P&L Automation System"><ArrowLeft size={18} /></Link>
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-slate-600">Powered by VvAI</p>
        </div>

        <header className="mt-5 rounded-2xl border border-cyan/[.12] bg-[linear-gradient(145deg,rgba(77,244,255,.07),rgba(255,255,255,.018)_45%,rgba(156,124,255,.05))] p-4 shadow-[0_22px_70px_rgba(0,0,0,.35)] md:p-6">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-cyan/25 bg-cyan/10 text-cyan"><BarChart3 size={21} /></span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-cyan">Business performance</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Business Health Dashboard</h1>
              <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">AI-Assisted Business Performance Analysis</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <DarkSelect
              label="Revenue period"
              value={period}
              onChange={setPeriod}
              options={[
                { label: "Monthly", value: "Monthly Revenue" },
                { label: "Yearly", value: "Yearly Revenue" },
                { label: "Total", value: "Total Revenue" },
              ]}
            />
            <DarkSelect
              label="Cost input mode"
              value={costMode}
              onChange={(value) => setCostMode(value as CostMode)}
              options={[
                { label: "RM", value: "rm" },
                { label: "Percentage (%)", value: "percent" },
              ]}
            />
          </div>
        </header>

        {!calculated ? <form className="mt-5 grid gap-4" onSubmit={(event) => { event.preventDefault(); handleAnalyze(); }}>
          <div className="flex items-center justify-between px-1">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-cyan">Step 1</p>
              <h2 className="mt-1 text-lg font-semibold">Business Inputs</h2>
            </div>
            <span className="text-xs text-slate-500">F&amp;B shown as example data</span>
          </div>

          <Card className="p-4 md:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2"><ListTree size={17} className="text-cyan" /><h3 className="font-semibold">Sales &amp; Cost Breakdown</h3></div>
                <p className="mt-2 text-xs leading-5 text-slate-500">Add each business category with its revenue and direct cost.</p>
              </div>
              <Button type="button" size="sm" variant="ghost" className="shrink-0" onClick={() => setCategories((items) => [...items, { id: `category-${Date.now()}`, name: "New Category", revenue: "", cost: "" }])}><Plus size={14} /> Add</Button>
            </div>
            <div className="mt-4 grid gap-3">
              {categories.map((category) => <div key={category.id} className="rounded-xl border border-white/[.08] bg-black/20 p-3 md:grid md:grid-cols-[1fr_150px_150px_40px] md:gap-2 md:p-2">
                <div className="flex items-center gap-2">
                  <label className="min-w-0 flex-1">
                    <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[.12em] text-slate-500 md:hidden">Category</span>
                    <Input value={category.name} onChange={(event) => updateCategory(category.id, "name", event.target.value)} placeholder="Category name" />
                  </label>
                  <button type="button" aria-label="Delete category" onClick={() => setCategories((items) => items.filter((item) => item.id !== category.id))} className="mt-5 grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/[.08] text-slate-500 transition hover:border-rose-400/40 hover:text-rose-300 md:hidden"><Trash2 size={15} /></button>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 md:mt-0 md:contents">
                  <label>
                    <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[.12em] text-slate-500 md:hidden">Sales / Revenue</span>
                    <Input className={numberInputClass} type="number" step="0.01" value={category.revenue} onChange={(event) => updateCategory(category.id, "revenue", event.target.value)} placeholder="Revenue" />
                  </label>
                  <label>
                    <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[.12em] text-slate-500 md:hidden">Cost ({costMode === "rm" ? "RM" : "%"})</span>
                    <Input className={numberInputClass} type="number" step="0.01" value={category.cost} onChange={(event) => updateCategory(category.id, "cost", event.target.value)} placeholder={costMode === "rm" ? "Cost RM" : "Cost %"} />
                  </label>
                </div>
                <button type="button" aria-label="Delete category" onClick={() => setCategories((items) => items.filter((item) => item.id !== category.id))} className="hidden h-12 w-10 place-items-center rounded-lg border border-white/[.08] text-slate-500 transition hover:border-rose-400/40 hover:text-rose-300 md:grid"><Trash2 size={15} /></button>
              </div>)}
            </div>
            {validationError && <p className="mt-4 rounded-lg border border-rose-400/25 bg-rose-500/10 p-3 text-sm leading-6 text-rose-200">{validationError}</p>}
            {validationWarning && <div className="mt-4 rounded-xl border border-amber-300/25 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
              <p className="font-semibold">{validationWarning.message}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button type="button" size="sm" onClick={continueAnalysis}>Continue Anyway</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setValidationWarning(null)}>Edit Inputs</Button>
              </div>
            </div>}
          </Card>

          <Card className="p-4 md:p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2"><ReceiptText size={17} className="text-cyan" /><h3 className="font-semibold">Operating Expenses</h3></div>
              <Button type="button" size="sm" variant="ghost" onClick={() => setExpenses((items) => [...items, { id: `expense-${Date.now()}`, name: "New Expense", amount: "" }])}><Plus size={14} /> Add</Button>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {expenses.map((expense) => <div key={expense.id} className="grid grid-cols-[1fr_110px_36px] gap-2 rounded-xl border border-white/[.08] bg-black/20 p-2 sm:grid-cols-[1fr_120px_36px]">
                <Input className="h-11 px-3" value={expense.name} onChange={(event) => updateExpense(expense.id, "name", event.target.value)} placeholder="Expense name" />
                <Input className={`${numberInputClass} h-11 px-3`} type="number" min="0" step="0.01" value={expense.amount} onChange={(event) => updateExpense(expense.id, "amount", event.target.value)} placeholder="RM" />
                <button type="button" aria-label="Delete expense" onClick={() => setExpenses((items) => items.filter((item) => item.id !== expense.id))} className="grid h-11 place-items-center rounded-lg text-slate-500 transition hover:bg-rose-400/10 hover:text-rose-300"><Trash2 size={15} /></button>
              </div>)}
            </div>
          </Card>

          <Card className="overflow-visible p-4 md:p-5">
            <button type="button" className="flex w-full items-center justify-between gap-3 text-left" onClick={() => setBudgetEnabled((value) => !value)}>
              <span className="flex items-center gap-2"><Target size={17} className="text-violet" /><span className="font-semibold">Budget Comparison <span className="font-normal text-slate-500">(Optional)</span></span></span>
              <ChevronDown size={17} className={`text-slate-500 transition ${budgetEnabled ? "rotate-180 text-cyan" : ""}`} />
            </button>
            {budgetEnabled && <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <label className="grid gap-2 text-xs font-semibold text-slate-400">Revenue Target<Input className={numberInputClass} type="number" min="0" step="0.01" value={budgetRevenue} onChange={(event) => setBudgetRevenue(event.target.value)} placeholder="RM" /></label>
              <label className="grid gap-2 text-xs font-semibold text-slate-400">Cost Target<Input className={numberInputClass} type="number" min="0" step="0.01" value={budgetCost} onChange={(event) => setBudgetCost(event.target.value)} placeholder="RM" /></label>
              <label className="grid gap-2 text-xs font-semibold text-slate-400">Expense Target<Input className={numberInputClass} type="number" min="0" step="0.01" value={budgetOperatingExpenses} onChange={(event) => setBudgetOperatingExpenses(event.target.value)} placeholder="RM" /></label>
            </div>}
          </Card>

          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cyan/[.12] bg-[#030303]/95 p-3 backdrop-blur-xl md:static md:border-0 md:bg-transparent md:p-0">
            <div className="mx-auto max-w-5xl"><Button className="min-h-12 w-full md:w-auto"><Brain size={17} /> Analyze Business</Button></div>
          </div>
        </form> : <div className="mt-6 grid gap-5">
          <div className="flex items-end justify-between gap-4 px-1">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-cyan">{period.replace(" Revenue", "")} analysis results</p>
              <h2 className="mt-1 text-2xl font-semibold">Business Performance</h2>
            </div>
            <p className="hidden text-sm text-slate-500 sm:block">Revenue: {formatCurrency(totals.revenue)}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {kpis.map(([label, value, status, Icon]) => {
              const isMargin = label === "Profit Margin";
              return <div key={label} className="min-h-36 rounded-2xl border border-cyan/[.13] bg-[linear-gradient(145deg,rgba(77,244,255,.055),rgba(255,255,255,.018))] p-4 shadow-[0_16px_45px_rgba(0,0,0,.22)]">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-500">{label}</p>
                  <Icon size={17} className="text-cyan" />
                </div>
                <p className={`mt-4 font-semibold tracking-tight ${isMargin ? "text-2xl text-cyan" : "text-xl text-white sm:text-2xl"}`}>{isMargin ? pct(value) : formatCurrency(value)}</p>
                <span className={`mt-4 inline-flex rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-wide ${statusClass(status)}`}>{status}</span>
              </div>;
            })}
          </div>

          <Button variant="outline" className="w-full" onClick={() => setShowDetails((value) => !value)}>
            {showDetails ? "Hide Detailed Breakdown" : "View Detailed Breakdown"}
            <ChevronDown size={16} className={`transition ${showDetails ? "rotate-180" : ""}`} />
          </Button>

          {showDetails && <div className="grid gap-4">
            <Card className="overflow-hidden">
              <div className="flex items-center gap-2 border-b border-white/[.08] px-4 py-4"><BarChart3 size={17} className="text-cyan" /><h3 className="font-semibold">P&amp;L Statement</h3></div>
              <div className="text-sm">
                <div className="flex items-center justify-between gap-4 px-4 py-3 font-semibold"><span>Revenue</span><span>{formatCurrency(totals.revenue)}</span></div>
                {categoryRows.map((row) => <div key={`revenue-${row.id}`} className="grid grid-cols-[1fr_auto] gap-3 px-4 py-2 text-slate-400"><span className="pl-3">{row.name} revenue</span><span>{formatCurrency(row.revenueValue)}</span></div>)}
                <div className="mt-2 border-t border-white/[.07] px-4 pt-2">
                  {categoryRows.map((row) => <div key={`cost-${row.id}`} className="grid grid-cols-[1fr_auto] gap-3 py-2 text-slate-400"><span className="pl-3">{row.name} cost</span><span>{formatCurrency(row.costValue)}</span></div>)}
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-white/[.08] px-4 py-3 font-semibold"><span>Total Cost</span><span>{formatCurrency(totals.cogs)}</span></div>
                <div className="flex items-center justify-between gap-4 border-t border-white/[.08] px-4 py-3 font-semibold"><span>Gross Profit</span><span>{formatCurrency(totals.grossProfit)}</span></div>
                <div className="px-4 pt-2">
                  {expenses.map((expense) => <div key={expense.id} className="grid grid-cols-[1fr_auto] gap-3 py-2 text-slate-400"><span className="pl-3">{expense.name}</span><span>{formatCurrency(toNumber(expense.amount))}</span></div>)}
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-white/[.08] px-4 py-3 font-semibold"><span>Operating Expenses</span><span>{formatCurrency(totals.operatingExpenses)}</span></div>
                <div className="flex items-center justify-between gap-4 border-t border-cyan/15 bg-cyan/[.045] px-4 py-4 text-base font-semibold"><span>Net Profit</span><span className="text-cyan">{formatCurrency(totals.netProfit)}</span></div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2"><ListTree size={17} className="text-cyan" /><h3 className="font-semibold">Category Summary</h3></div>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  ["Top Revenue", breakdown.topRevenue ? `${breakdown.topRevenue.name} · ${formatCurrency(breakdown.topRevenue.revenueValue)}` : "Not enough data"],
                  ["Highest Margin", breakdown.highestMargin ? `${breakdown.highestMargin.name} · ${pct(breakdown.highestMargin.margin)}` : "Not enough data"],
                  ["Largest Cost", breakdown.largestCost ? `${breakdown.largestCost.name} · ${formatCurrency(breakdown.largestCost.costValue)}` : "Not enough data"],
                  ["Largest Expense", breakdown.largestExpense ? `${breakdown.largestExpense.name} · ${formatCurrency(toNumber(breakdown.largestExpense.amount))}` : "Not enough data"],
                ].map(([label, value]) => <div key={label} className="rounded-xl border border-white/[.07] bg-black/20 p-3"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 text-xs font-semibold leading-5 text-white">{value}</p></div>)}
              </div>
            </Card>

            {budgetEnabled && <Card className="p-4">
              <div className="flex items-center gap-2"><Target size={17} className="text-violet" /><h3 className="font-semibold">Budget &amp; Variance Analysis</h3></div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {budgetComparisons.map(([label, actual, budget]) => {
                  const variance = actual - budget;
                  return <div key={label} className="rounded-xl border border-white/[.08] bg-black/20 p-3 text-xs leading-5 text-slate-400">
                    <p className="font-semibold text-white">{label}</p>
                    <div className="mt-2 flex justify-between"><span>Actual</span><span>{formatCurrency(actual)}</span></div>
                    <div className="flex justify-between"><span>Target</span><span>{formatCurrency(budget)}</span></div>
                    <div className="mt-1 flex justify-between border-t border-white/[.06] pt-1 text-cyan"><span>Variance</span><span>{formatCurrency(variance)} · {variancePercent(actual, budget)}</span></div>
                  </div>;
                })}
              </div>
            </Card>}
          </div>}

          <Card className="p-4 md:p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2"><Brain size={18} className="text-cyan" /><h3 className="font-semibold">AI Insights</h3></div>
              <span className="text-[9px] font-bold uppercase tracking-[.14em] text-slate-600">{insights.length} business signals</span>
            </div>
            <div className="mt-4 grid gap-3">
              {visibleInsights.map((insight, index) => <div key={insight.title} className="rounded-xl border border-cyan/[.12] bg-cyan/[.035] p-4 text-sm leading-6">
                <div className="flex items-start justify-between gap-3"><p className="font-semibold text-white">{insight.title}</p><span className="rounded-full border border-cyan/15 bg-cyan/10 px-2 py-0.5 text-[9px] font-bold text-cyan">#{index + 1}</span></div>
                <p className="mt-2 text-slate-400">{insight.detail}</p>
                <p className="mt-3 border-l-2 border-cyan/40 pl-3 text-cyan">{insight.action}</p>
              </div>)}
            </div>
            {insights.length > 2 && <Button className="mt-3 w-full" variant="ghost" onClick={() => setShowAllInsights((value) => !value)}>{showAllInsights ? "Hide Extra Insights" : "Show More Insights"}</Button>}
          </Card>

          <Card className="p-4 md:p-5">
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-cyan">Feedback</p>
            <h3 className="mt-2 font-semibold">Was this useful?</h3>
            <div className="mt-4 grid gap-4">
              <label className="grid gap-2 text-xs font-semibold text-slate-400">Business Type <span className="font-normal text-slate-600">Optional</span><Input value={businessType} onChange={(event) => setBusinessType(event.target.value)} placeholder="Restaurant, retail, service business..." /></label>
              <fieldset>
                <legend className="text-xs font-semibold text-slate-400">Rating <span className="text-cyan">*</span></legend>
                <div className="mt-2 grid grid-cols-5 gap-2">
                  {["1", "2", "3", "4", "5"].map((value) => <label key={value} className={`grid min-h-11 place-items-center rounded-lg border text-sm font-semibold transition ${rating === value ? "border-cyan/40 bg-cyan/10 text-cyan" : "border-white/[.08] bg-black/20 text-slate-500"}`}><input className="sr-only" type="radio" name="dashboard-rating" value={value} checked={rating === value} onChange={() => setRating(value)} />{value}</label>)}
                </div>
              </fieldset>
              <fieldset>
                <legend className="text-xs font-semibold text-slate-400">Would you use this again? <span className="text-cyan">*</span></legend>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {["Yes", "Maybe", "No"].map((value) => <label key={value} className={`grid min-h-11 place-items-center rounded-lg border text-sm font-semibold transition ${wouldUseAgain === value ? "border-cyan/40 bg-cyan/10 text-cyan" : "border-white/[.08] bg-black/20 text-slate-500"}`}><input className="sr-only" type="radio" name="dashboard-would-use-again" value={value} checked={wouldUseAgain === value} onChange={() => setWouldUseAgain(value)} />{value}</label>)}
                </div>
              </fieldset>
              <label className="grid gap-2 text-xs font-semibold text-slate-400">Feedback Notes <span className="font-normal text-slate-600">Optional</span><Textarea className="min-h-24" value={feedback} onChange={(event) => { setFeedback(event.target.value); setFeedbackSaved(false); }} placeholder="What should VvAI improve or explain better?" /></label>
            </div>
            <Button className="mt-4 w-full" variant="outline" disabled={feedbackSubmitting} onClick={() => void saveFeedback()}>{feedbackSubmitting ? "Saving..." : "Submit Feedback"}</Button>
            {feedbackSaved && <p className="mt-3 text-sm font-semibold text-cyan">Thank you for the feedback. Your response has been recorded.</p>}
            {feedbackError && <p className="mt-3 rounded-lg border border-rose-400/25 bg-rose-500/10 p-3 text-sm leading-6 text-rose-200">{feedbackError}</p>}
          </Card>

          <Button variant="outline" className="w-full" onClick={() => { setCalculated(false); window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" })); }}><ArrowLeft size={15} /> Edit Input Data</Button>
          <p className="pb-4 text-center text-[10px] font-bold uppercase tracking-[.2em] text-slate-700">Powered by VvAI</p>
        </div>}
      </div>
    </section>
  </VvaiProductShell>;
}
