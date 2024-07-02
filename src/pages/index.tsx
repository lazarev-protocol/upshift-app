import useFetcher from '@/hooks/use-fetcher';
import { OverallStats } from '@/ui/features/overall-stats';
import { EarnTable } from '@/ui/features/table';
import { Base } from '@/ui/layout/Base';
import { Section } from '@/ui/layout/Section';

const HomePage = () => {
  const { data, isLoading, isFetched } = useFetcher({
    queryKey: ['lending-pools'],
    initialData: [],
  });

  console.log('data', data);
  console.log('isLoading', isLoading);
  console.log('isFetched', isFetched);

  return (
    <Base>
      <Section
        id="earn-table"
        title="Earn"
        description="Earn yields from real institutional loans via the Lazarev protocol. Democratizing high-yield investments traditionally limited to financial institutions."
        action={<OverallStats />}
      >
        <EarnTable />
      </Section>
    </Base>
  );
};

export default HomePage;
