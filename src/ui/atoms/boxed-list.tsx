import { useThemeMode } from '@/stores/theme';
import type { ITheme } from '@/utils/types';
import { Stack, styled, Typography } from '@mui/material';

type IBoxedListItem = {
  label: string | JSX.Element | number;
  value: string | JSX.Element | number;
};

const StackOutline = styled(Stack)<{ thememode: ITheme }>`
  border-radius: 4px;
  padding: 0.5rem 1rem;
  gap: 6px;
  border: 1px solid
    ${({ thememode }) =>
      thememode === 'dark' ? 'rgba(255,255,255,0.23)' : 'rgba(0,0,0,0.23)'};
`;

const StackRow = styled(Stack)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export default function BoxedListAtom(props: { items: IBoxedListItem[] }) {
  const { theme } = useThemeMode();

  return (
    <StackOutline thememode={theme}>
      {props.items.map((item, i) => (
        <StackRow key={`boxed-list-item-${i}`}>
          <Typography variant="body2">{item.label}</Typography>
          <Typography variant="body2" fontFamily="monospace">
            {item.value}
          </Typography>
        </StackRow>
      ))}
    </StackOutline>
  );
}