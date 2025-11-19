'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function DistributorProfile() {
    return (
        <Card className="max-w-3xl mx-auto mt-10 p-6 shadow-md">
            <CardHeader className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarFallback>DP</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-xl font-semibold">Distributor Name</h2>
                    <p className="text-sm text-muted-foreground">ID: 123456789</p>
                </div>
            </CardHeader>

            <Separator className="my-4" />

            <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <strong>Joining Date:</strong> 12/12/25
                </div>
                <div>
                    <strong>PAN Number:</strong> JBGPX1235D
                </div>
                <div>
                    <strong>Total Team:</strong> 500
                </div>
                <div>
                    <strong>Active Team:</strong> 400
                </div>
                <div>
                    <strong>Monthly Self BV:</strong> 100
                </div>
                <div>
                    <strong>Weekly Self BV:</strong> 564
                </div>
                <div>
                    <strong>Weekly Group BV:</strong> 5,574,366
                </div>
                <div>
                    <strong>Total Payout:</strong> ₹20,000
                </div>
                <div>
                    <strong>Weekly Payout:</strong> ₹5,500
                </div>
                <div>
                    <strong>Rank:</strong> 0
                </div>
                <div>
                    <strong>Rank Target:</strong> 25,000 / 15,000
                </div>
                <div>
                    <strong>Upcoming Rank:</strong>{' '}
                    <Badge variant="outline" className="ml-1">Star</Badge>
                </div>
            </CardContent>
        </Card>
    );
}