import { Flex } from '@webkom/lego-bricks';
import { CHART_COLORS } from 'app/components/Chart/utils';
import styles from './Chart.css';
import type { DistributionDataPoint } from 'app/components/Chart/utils';

const ChartLabel = ({
  distributionData,
}: {
  distributionData: DistributionDataPoint[];
}) => {
  return (
    <Flex column gap="0.5rem" className={styles.chartLabel}>
      {distributionData.map((dataPoint, i) => (
        <Flex key={i} alignItems="center" gap="0.5rem">
          <svg className={styles.circle} viewBox="0 0 32 32">
            <circle
              cx="16"
              cy="16"
              r="16"
              fill={CHART_COLORS[i % CHART_COLORS.length]}
              stroke="white"
              strokeWidth="8"
            />
          </svg>

          <span>{dataPoint.name}</span>
        </Flex>
      ))}
    </Flex>
  );
};

export default ChartLabel;
