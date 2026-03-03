'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Calculator, Wallet, TrendingUp, ArrowRight } from "lucide-react";

const AmazeAyurvedaPlan = () => {
  const [purchaseAmount, setPurchaseAmount] = useState<number>(1000);

  const levels = [
    { level: "Self", rate: 5, rank: "Member" },
    { level: "L1 (Direct)", rate: 15, rank: "Distributor" },
    { level: "L2", rate: 10, rank: "Associate" },
    { level: "L3", rate: 5, rank: "Associate" },
    { level: "L4", rate: 4, rank: "Associate" },
    { level: "L5", rate: 3, rank: "Associate" },
    { level: "L6", rate: 2, rank: "Associate" },
    { level: "L7", rate: 2, rank: "Star" },
    { level: "L8", rate: 1, rank: "Super Star" },
    { level: "L9", rate: 1, rank: "Diamond" },
    { level: "L10", rate: 1, rank: "Star Diamond" },
    { level: "L11", rate: 1, rank: "Diplomate" },
    { level: "L12", rate: 1, rank: "Star Diplomate" },
    { level: "L13", rate: 1, rank: "Diamond Diplomate" },
    { level: "L14", rate: 1, rank: "Crown Ambassador" },
    { level: "L15", rate: 1, rank: "Chairman" },
  ];

  const calculateCommission = (rate: number) => (purchaseAmount * (rate / 100)).toFixed(2);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 min-h-screen">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-emerald-900">Amaze Ayurveda</h1>
        <p className="text-muted-foreground text-lg">Interactive Business Growth Plan</p>
      </div>

      {/* --- Commission Calculator Section --- */}
      <Card className="border-2 border-emerald-200 shadow-lg">
        <CardHeader className="bg-emerald-50/50">
          <div className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-emerald-700" />
            <CardTitle>Earnings Estimator</CardTitle>
          </div>
          <CardDescription>Enter a purchase amount to see how commissions are distributed across levels.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label htmlFor="amount" className="text-base font-semibold">Total Purchase Amount (₹)</Label>
                <span className="text-emerald-700 font-bold">₹{purchaseAmount.toLocaleString()}</span>
              </div>
              <Input 
                id="amount" 
                type="number" 
                value={purchaseAmount} 
                onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                className="text-lg h-12"
              />
              <Slider 
                value={[purchaseAmount]} 
                max={50000} 
                step={500} 
                onValueChange={(val) => setPurchaseAmount(val[0])}
                className="py-4"
              />
            </div>

            <div className="bg-emerald-900 text-white p-6 rounded-xl space-y-2 relative overflow-hidden">
               <TrendingUp className="absolute right-[-10px] bottom-[-10px] h-32 w-32 opacity-10" />
               <p className="text-emerald-200 text-sm font-medium uppercase tracking-wider">Total Level Distribution</p>
               <div className="text-4xl font-bold">
                 ₹{(purchaseAmount * 0.45).toLocaleString()} {/* Based on sum of level rates */}
               </div>
               <p className="text-xs text-emerald-300 italic">*Based on a full 15-level payout (45% total)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- Levels Table with Real-time Math --- */}
      <Card>
        <CardHeader>
            <CardTitle>Detailed Payout Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border bg-white overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100">
                  <TableHead>Level & Rank</TableHead>
                  <TableHead>Rate (%)</TableHead>
                  <TableHead className="text-right">Estimated Commission</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {levels.map((item, idx) => (
                  <TableRow key={item.level} className="group">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{item.level}</span>
                        <span className="text-xs text-muted-foreground">{item.rank}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50">
                            {item.rate}%
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-emerald-600">
                      ₹{calculateCommission(item.rate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AmazeAyurvedaPlan;