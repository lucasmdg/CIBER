import { Card, CardContent, CardHeader, CardTitle, CardSubtitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const frameworks = [
  { name: "NIST CSF", value: 78 },
  { name: "ISO 27001", value: 64 },
  { name: "CIS Controls v8", value: 71 },
  { name: "MITRE ATT&CK coverage", value: 53 },
  { name: "PCI DSS 4.0", value: 49 }
];

export function ComplianceCard() {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Compliance & Coverage</CardTitle>
          <CardSubtitle>Self-attested controls; update quarterly</CardSubtitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {frameworks.map((f) => (
            <li key={f.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>{f.name}</span>
                <span className="text-cyber-200">{f.value}%</span>
              </div>
              <Progress value={f.value} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
