
import { useRef } from "react";
import { 
  Chart as ChartJS, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Tooltip, 
  Legend,
  ScatterController,
  ChartData,
  ChartOptions
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { Resume } from "@/pages/Index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ScatterController
);

interface ComparisonChartProps {
  resumes: Resume[];
}

const ComparisonChart = ({ resumes }: ComparisonChartProps) => {
  const chartRef = useRef<ChartJS>(null);

  const colors = [
    "rgba(255, 99, 132, 0.7)",
    "rgba(54, 162, 235, 0.7)",
    "rgba(255, 206, 86, 0.7)",
    "rgba(75, 192, 192, 0.7)",
    "rgba(153, 102, 255, 0.7)",
    "rgba(255, 159, 64, 0.7)",
    "rgba(199, 199, 199, 0.7)",
    "rgba(83, 102, 255, 0.7)",
    "rgba(40, 159, 64, 0.7)",
    "rgba(210, 142, 95, 0.7)"
  ];

  const scatterData: ChartData<"scatter"> = {
    datasets: resumes.map((resume, index) => ({
      label: resume.candidateName,
      data: [{
        x: resume.matchScore,
        y: resume.skills.length,
      }],
      backgroundColor: colors[index % colors.length],
      borderColor: colors[index % colors.length].replace("0.7", "1"),
      borderWidth: 1,
      pointRadius: 10,
      pointHoverRadius: 12,
    })),
  };

  const options: ChartOptions<"scatter"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Match Score (%)',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        min: 0,
        max: 100
      },
      y: {
        title: {
          display: true,
          text: 'Number of Skills',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        min: 0
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.datasetIndex;
            if (index === undefined || !resumes[index]) return [];
            const resume = resumes[index];
            return [
              `${resume.candidateName}`,
              `Match Score: ${resume.matchScore}%`,
              `Total Skills: ${resume.skills.length}`,
              `Matched: ${resume.matchedSkills.length}`,
              `Missing: ${resume.missingSkills.length}`
            ];
          }
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Candidates Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px]">
            <Chart
              ref={chartRef}
              type="scatter"
              data={scatterData}
              options={options}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills Comparison Table</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left p-3">Candidate</th>
                  <th className="text-center p-3">Match Score</th>
                  <th className="text-center p-3">Total Skills</th>
                  <th className="text-center p-3">Matched Skills</th>
                  <th className="text-center p-3">Missing Skills</th>
                </tr>
              </thead>
              <tbody>
                {resumes.map((resume, index) => (
                  <tr key={resume.id} className={index % 2 === 0 ? "bg-muted/50" : ""}>
                    <td className="p-3 font-medium">{resume.candidateName}</td>
                    <td className="text-center p-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        resume.matchScore >= 80 
                          ? 'bg-green-100 text-green-800' 
                          : resume.matchScore >= 50 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {resume.matchScore}%
                      </span>
                    </td>
                    <td className="text-center p-3">{resume.skills.length}</td>
                    <td className="text-center p-3">{resume.matchedSkills.length}</td>
                    <td className="text-center p-3">{resume.missingSkills.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonChart;
