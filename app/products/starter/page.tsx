"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ChevronDown, Plus, Sparkles, Trash2 } from "lucide-react";
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
    if (value >= 20) return "Healthy";
    if (value >= 10) return "Needs Attention";
    return "Warning";
  }
  if (type === "profit") {
    if (value > 0) return "Healthy";
    return "Warning";
  }
  if (type === "cost" || type === "expense") {
    if (value <= 35) return "Healthy";
    if (value <= 60) return "Needs Attention";
    return "Warning";
  }
  return "Needs Attention";
}

function statusClass(status: string) {
  if (status === "Healthy") return "border-cyan/20 bg-cyan/10 text-cyan";
  if (status === "Needs Attention") return "border-amber-300/20 bg-amber-300/10 text-amber-200";
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
        setValidationWarning({ message: "Total cost percentage exceeds 100%. Please review your inputs before continuing." });
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
    setInsights([]);
    setShowAllInsights(false);
    setFeedbackSaved(false);
  }

  const kpis = [
    ["Revenue", totals.revenue, "Healthy"],
    ["COGS / Cost", totals.cogs, statusFor(totals.revenue > 0 ? (totals.cogs / totals.revenue) * 100 : 0, "cost")],
    ["Gross Profit", totals.grossProfit, statusFor(totals.grossProfit, "profit")],
    ["Operating Expenses", totals.operatingExpenses, statusFor(totals.revenue > 0 ? (totals.operatingExpenses / totals.revenue) * 100 : 0, "expense")],
    ["Net Profit", totals.netProfit, statusFor(totals.netProfit, "profit")],
  ] as const;

  const budgetComparisons = [
    ["Revenue vs Target", totals.revenue, toNumber(budgetRevenue)],
    ["Cost vs Target", totals.cogs, toNumber(budgetCost)],
    ["Expenses vs Target", totals.operatingExpenses, toNumber(budgetOperatingExpenses)],
  ] as const;

  const visibleInsights = showAllInsights ? insights : insights.slice(0, 2);

  return <VvaiProductShell>
    <section className="bg-[#030303] px-5 py-12 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/products/neural-command" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white"><ArrowLeft size={15} /> Back to P&L Automation System</Link>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_390px]">
          <div>
            <p className="text-xs font-bold tracking-[.2em] text-cyan">BUSINESS HEALTH DASHBOARD</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">P&L Automation System</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">Create category-level revenue and cost inputs, calculate gross profit and net profit, then generate rule-based insights from the actual business mix.</p>
            <Card className="mt-8 border-cyan/15 bg-cyan/[.045] p-5 text-sm leading-6 text-slate-400">Free Version 1 access. Unlimited usage. No login, database, checkout, or payment flow required.</Card>

            <Card className="mt-6 p-5 md:p-6">
              <form className="grid gap-5" onSubmit={(event) => { event.preventDefault(); handleAnalyze(); }}>
                <div className="grid gap-4 md:grid-cols-2">
                  <DarkSelect
                    label="Revenue period"
                    value={period}
                    onChange={setPeriod}
                    options={[
                      { label: "Monthly Revenue", value: "Monthly Revenue" },
                      { label: "Yearly Revenue", value: "Yearly Revenue" },
                      { label: "Total Revenue", value: "Total Revenue" },
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

                <Card className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-white">Sales & Cost Breakdown</h2>
                      <p className="mt-1 text-xs text-slate-500">Add each business category with its sales revenue and direct cost.</p>
                    </div>
                    <Button type="button" size="sm" variant="ghost" onClick={() => setCategories((items) => [...items, { id: `category-${Date.now()}`, name: "New Category", revenue: "", cost: "" }])}><Plus size={14} /> Add Category</Button>
                  </div>
                  <div className="mt-4 grid gap-3">
                    <div className="hidden grid-cols-[1fr_150px_150px_36px] gap-2 px-1 text-[11px] font-bold uppercase tracking-[.14em] text-slate-500 md:grid">
                      <span>Category</span>
                      <span>Sales / Revenue</span>
                      <span>Cost</span>
                      <span>Action</span>
                    </div>
                    {categories.map((category) => <div key={category.id} className="grid gap-2 md:grid-cols-[1fr_150px_150px_36px]">
                      <label className="grid gap-1 md:block"><span className="text-xs font-semibold text-slate-500 md:hidden">Category</span><Input value={category.name} onChange={(event) => updateCategory(category.id, "name", event.target.value)} placeholder="Category name" /></label>
                      <label className="grid gap-1 md:block"><span className="text-xs font-semibold text-slate-500 md:hidden">Sales / Revenue</span><Input className={numberInputClass} type="number" step="0.01" value={category.revenue} onChange={(event) => updateCategory(category.id, "revenue", event.target.value)} placeholder="Sales / Revenue" /></label>
                      <label className="grid gap-1 md:block"><span className="text-xs font-semibold text-slate-500 md:hidden">Cost</span><Input className={numberInputClass} type="number" step="0.01" value={category.cost} onChange={(event) => updateCategory(category.id, "cost", event.target.value)} placeholder={costMode === "rm" ? "Cost RM" : "Cost %"} /></label>
                      <button type="button" aria-label="Delete category" onClick={() => setCategories((items) => items.filter((item) => item.id !== category.id))} className="grid h-12 place-items-center rounded-lg border border-white/[.10] bg-black/25 text-slate-400 transition hover:border-rose-400/40 hover:text-rose-300"><Trash2 size={16} /></button>
                    </div>)}
                  </div>
                  {validationError && <p className="mt-4 rounded-lg border border-rose-400/25 bg-rose-500/10 p-3 text-sm leading-6 text-rose-200">{validationError}</p>}
                  {validationWarning && <div className="mt-4 rounded-lg border border-amber-300/25 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
                    <p>{validationWarning.message}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button type="button" size="sm" onClick={continueAnalysis}>Continue Anyway</Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => setValidationWarning(null)}>Edit Inputs</Button>
                    </div>
                  </div>}
                </Card>

                <Card className="p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-semibold text-white">Operating Expenses</h2>
                    <Button type="button" size="sm" variant="ghost" onClick={() => setExpenses((items) => [...items, { id: `expense-${Date.now()}`, name: "New Expense", amount: "" }])}><Plus size={14} /> Add Expense</Button>
                  </div>
                  <div className="mt-4 grid gap-3">
                    {expenses.map((expense) => <div key={expense.id} className="grid gap-2 md:grid-cols-[1fr_160px_36px]">
                      <Input value={expense.name} onChange={(event) => updateExpense(expense.id, "name", event.target.value)} placeholder="Expense name" />
                      <Input className={numberInputClass} type="number" min="0" step="0.01" value={expense.amount} onChange={(event) => updateExpense(expense.id, "amount", event.target.value)} placeholder="Amount RM" />
                      <button type="button" aria-label="Delete expense" onClick={() => setExpenses((items) => items.filter((item) => item.id !== expense.id))} className="grid h-12 place-items-center rounded-lg border border-white/[.10] bg-black/25 text-slate-400 transition hover:border-rose-400/40 hover:text-rose-300"><Trash2 size={16} /></button>
                    </div>)}
                  </div>
                </Card>

                <Card className="p-4">
                  <label className="flex items-center gap-3 text-sm font-semibold text-slate-300">
                    <input type="checkbox" checked={budgetEnabled} onChange={(event) => setBudgetEnabled(event.target.checked)} />
                    Enable Budget Comparison
                  </label>
                  <p className="mt-2 text-xs leading-5 text-slate-500">Targets are used for variance comparison. Leave empty if you do not track budgets.</p>
                  {budgetEnabled && <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <label className="grid gap-2 text-sm font-semibold text-slate-300">Revenue Target <span className="font-normal text-slate-500">(Optional)</span><Input className={numberInputClass} type="number" min="0" step="0.01" value={budgetRevenue} onChange={(event) => setBudgetRevenue(event.target.value)} placeholder="Revenue Target" /></label>
                    <label className="grid gap-2 text-sm font-semibold text-slate-300">Cost Target <span className="font-normal text-slate-500">(Optional)</span><Input className={numberInputClass} type="number" min="0" step="0.01" value={budgetCost} onChange={(event) => setBudgetCost(event.target.value)} placeholder="Cost Target" /></label>
                    <label className="grid gap-2 text-sm font-semibold text-slate-300 md:col-span-2">Expense Target <span className="font-normal text-slate-500">(Optional)</span><Input className={numberInputClass} type="number" min="0" step="0.01" value={budgetOperatingExpenses} onChange={(event) => setBudgetOperatingExpenses(event.target.value)} placeholder="Expense Target" /></label>
                  </div>}
                </Card>

                <Button className="w-full md:w-fit">Analyze Business</Button>
              </form>
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="p-5">
              <p className="text-xs font-bold tracking-[.18em] text-cyan">ANALYSIS OUTPUT</p>
              {calculated ? <div className="mt-5 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {kpis.map(([label, value, status]) => <div key={label} className="rounded-xl border border-white/[.08] bg-black/25 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[.12em] text-slate-500">{label}</p>
                      <span className={`rounded-full border px-2 py-1 text-[10px] font-bold ${statusClass(status)}`}>{status}</span>
                    </div>
                    <p className="mt-3 text-xl font-semibold text-white">{formatCurrency(value)}</p>
                  </div>)}
                  <div className="rounded-xl border border-cyan/15 bg-cyan/[.06] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[.12em] text-slate-500">Profit Margin</p>
                      <span className={`rounded-full border px-2 py-1 text-[10px] font-bold ${statusClass(statusFor(totals.profitMargin, "margin"))}`}>{statusFor(totals.profitMargin, "margin")}</span>
                    </div>
                    <p className="mt-3 text-2xl font-semibold text-cyan">{pct(totals.profitMargin)}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-white/[.08] bg-black/25 p-4">
                  <p className="text-xs font-bold tracking-[.18em] text-cyan">BREAKDOWN SUMMARY</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-white/[.08] bg-black/25 p-3"><p className="text-xs text-slate-500">Top Revenue Category</p><p className="mt-2 font-semibold text-white">{breakdown.topRevenue ? `${breakdown.topRevenue.name} (${formatCurrency(breakdown.topRevenue.revenueValue)})` : "Not enough data"}</p></div>
                    <div className="rounded-lg border border-white/[.08] bg-black/25 p-3"><p className="text-xs text-slate-500">Highest Margin Category</p><p className="mt-2 font-semibold text-white">{breakdown.highestMargin ? `${breakdown.highestMargin.name} (${pct(breakdown.highestMargin.margin)})` : "Not enough data"}</p></div>
                    <div className="rounded-lg border border-white/[.08] bg-black/25 p-3"><p className="text-xs text-slate-500">Largest Cost Category</p><p className="mt-2 font-semibold text-white">{breakdown.largestCost ? `${breakdown.largestCost.name} (${formatCurrency(breakdown.largestCost.costValue)})` : "Not enough data"}</p></div>
                    <div className="rounded-lg border border-white/[.08] bg-black/25 p-3"><p className="text-xs text-slate-500">Largest Operating Expense</p><p className="mt-2 font-semibold text-white">{breakdown.largestExpense ? `${breakdown.largestExpense.name} (${formatCurrency(toNumber(breakdown.largestExpense.amount))})` : "Not enough data"}</p></div>
                  </div>
                </div>
                {budgetEnabled && <div className="rounded-lg border border-white/[.08] bg-black/25 p-3 text-sm leading-6 text-slate-400">
                  <p className="text-xs font-bold tracking-[.18em] text-cyan">BUDGET COMPARISON</p>
                  <div className="mt-3 grid gap-3">
                    {budgetComparisons.map(([label, actual, budget]) => {
                      const variance = actual - budget;
                      return <div key={label} className="rounded-lg border border-white/[.08] bg-black/25 p-3">
                        <p className="font-semibold text-white">{label}</p>
                        <p className="mt-2">Actual: {formatCurrency(actual)}</p>
                        <p>Target: {formatCurrency(budget)}</p>
                        <p>Variance: {formatCurrency(variance)} ({variancePercent(actual, budget)})</p>
                      </div>;
                    })}
                  </div>
                </div>}
              </div> : <p className="mt-4 text-sm leading-6 text-slate-500">Add category revenue, category cost, and operating expenses to generate analysis.</p>}
            </Card>

            <Card className="p-5">
              <p className="text-xs font-bold tracking-[.18em] text-cyan">AI INSIGHT</p>
              <Button className="mt-4 w-full" variant="outline" disabled={!calculated} onClick={() => { setInsights(buildInsights(categories, expenses, costMode)); setShowAllInsights(false); }}><Sparkles size={15} /> Generate AI Insight</Button>
              {!calculated && <p className="mt-3 text-xs leading-5 text-slate-500">Analyze the business first.</p>}
              <div className="mt-4 grid gap-3">{visibleInsights.map((insight) => <div key={insight.title} className="rounded-lg border border-white/[.08] bg-black/25 p-4 text-sm leading-6 text-slate-400">
                <p className="font-semibold text-white">{insight.title}</p>
                <p className="mt-2">{insight.detail}</p>
                <p className="mt-2 text-cyan">{insight.action}</p>
              </div>)}</div>
              {insights.length > 2 && <Button className="mt-4 w-full" variant="ghost" onClick={() => setShowAllInsights((value) => !value)}>{showAllInsights ? "Hide Extra Insights" : "Show More Insights"}</Button>}
            </Card>

            {calculated && <Card className="p-5">
              <p className="text-sm font-semibold text-white">Was this useful?</p>
              <div className="mt-4 grid gap-4">
                <label className="grid gap-2 text-sm font-semibold text-slate-300">
                  Business Type <span className="font-normal text-slate-500">Optional</span>
                  <Input value={businessType} onChange={(event) => setBusinessType(event.target.value)} placeholder="Restaurant, retail, e-commerce..." />
                </label>
                <fieldset className="grid gap-3">
                  <legend className="text-sm font-semibold text-slate-300">Rating <span className="text-cyan">*</span></legend>
                  <div className="grid grid-cols-5 gap-2">
                    {["1", "2", "3", "4", "5"].map((value) => <label key={value} className="rounded-lg border border-white/[.08] bg-black/20 px-3 py-3 text-center text-sm text-slate-400">
                      <input required className="mr-2" type="radio" name="dashboard-rating" value={value} checked={rating === value} onChange={() => setRating(value)} />
                      {value}
                    </label>)}
                  </div>
                </fieldset>
                <fieldset className="grid gap-3">
                  <legend className="text-sm font-semibold text-slate-300">Would you use this again? <span className="text-cyan">*</span></legend>
                  <div className="grid grid-cols-3 gap-2">
                    {["Yes", "Maybe", "No"].map((value) => <label key={value} className="rounded-lg border border-white/[.08] bg-black/20 px-4 py-3 text-sm text-slate-400">
                      <input required className="mr-2" type="radio" name="dashboard-would-use-again" value={value} checked={wouldUseAgain === value} onChange={() => setWouldUseAgain(value)} />
                      {value}
                    </label>)}
                  </div>
                </fieldset>
                <label className="grid gap-2 text-sm font-semibold text-slate-300">
                  Feedback <span className="font-normal text-slate-500">Optional</span>
                  <Textarea value={feedback} onChange={(event) => { setFeedback(event.target.value); setFeedbackSaved(false); }} placeholder="What should VvAI improve or explain better?" />
                </label>
              </div>
              <Button className="mt-4 w-full" variant="outline" disabled={feedbackSubmitting} onClick={() => void saveFeedback()}>{feedbackSubmitting ? "Saving..." : "Submit Feedback"}</Button>
              {feedbackSaved && <p className="mt-3 text-sm font-semibold text-cyan">Thank you for the feedback. Your response has been recorded.</p>}
              {feedbackError && <p className="mt-3 rounded-lg border border-rose-400/25 bg-rose-500/10 p-3 text-sm leading-6 text-rose-200">{feedbackError}</p>}
            </Card>}
          </div>
        </div>
      </div>
    </section>
  </VvaiProductShell>;
}
