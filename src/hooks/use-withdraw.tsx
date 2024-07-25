import { queryClient } from '@/config/react-query';
import Toast from '@/ui/atoms/toast';
import { BUTTON_TEXTS } from '@/utils/constants';
import type { IAddress } from '@augustdigital/sdk';
import { ABI_LENDING_POOLS, toNormalizedBn } from '@augustdigital/sdk';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { erc20Abi } from 'viem';
import { readContract, waitForTransactionReceipt } from 'viem/actions';
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWalletClient,
} from 'wagmi';

type IUseDepositProps = {
  value?: string;
  asset?: IAddress;
  clearInput?: () => void;
  pool?: IAddress;
  closeModal?: () => void;
};

export default function useWithdraw(props: IUseDepositProps) {
  // States
  const [expected, setExpected] = useState({
    fee: toNormalizedBn(0),
    out: toNormalizedBn(0),
    loading: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [button, setButton] = useState({
    text: BUTTON_TEXTS.zero,
    disabled: true,
  });

  // Meta hooks
  const provider = usePublicClient();
  const { data: signer } = useWalletClient();
  const { address } = useAccount();
  const { data: decimals } = useReadContract({
    address: props.asset,
    abi: erc20Abi,
    functionName: 'decimals',
  });
  const { data: symbol } = useReadContract({
    address: props.asset,
    abi: erc20Abi,
    functionName: 'symbol',
  });

  // Functions
  async function requestWithdraw() {
    if (!(address && provider)) {
      console.error('#requestWithdraw: no wallet is connected');
      return;
    }
    if (!props.pool) {
      console.error('#requestWithdraw: pool address is undefined');
      return;
    }
    if (!props.asset) {
      console.error('#requestWithdraw: pool asset is undefined');
      return;
    }
    if (!props.value) {
      console.error('#requestWithdraw: amount input is undefined');
      return;
    }
    const normalized = toNormalizedBn(props.value, decimals);

    if (normalized.raw === BigInt(0)) {
      console.error('#requestWithdraw: amount input is zero');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      // Request withdrawal of input amount
      setButton({ text: BUTTON_TEXTS.submitting, disabled: true });
      const redeemHash = await signer?.writeContract({
        account: address,
        address: props.pool,
        abi: ABI_LENDING_POOLS,
        functionName: 'requestRedeem',
        args: [normalized.raw, address, address],
      });
      await toast.promise(
        waitForTransactionReceipt(provider, { hash: redeemHash! }),
        {
          success: {
            render: (
              <Toast
                msg={`Successfully requested ${normalized.normalized} ${symbol} to be withdrawn:`}
                hash={redeemHash}
              />
            ),
            type: 'success',
          },
          error: `Error requesting a ${normalized.normalized} ${symbol} withdrawal`,
          pending: `Submitted withdrawal request for ${normalized.normalized} ${symbol}`,
        },
      );

      // Refetch queries
      queryClient.refetchQueries();

      // Success states
      setIsSuccess(true);
      setButton({ text: BUTTON_TEXTS.success, disabled: true });
      console.log(
        '#requestWithdraw: successfully executed transaction',
        redeemHash,
      );
    } catch (e) {
      console.error(e);
      if (String(e).toLowerCase().includes('user rejected')) {
        toast.warn('User rejected transaction');
        setButton({ text: BUTTON_TEXTS.submit, disabled: false });
      } else {
        toast.error('Error executing transaction');
        setButton({ text: BUTTON_TEXTS.error, disabled: true });
      }
      if (String(e).includes(':')) {
        const err = String(e)?.split(':')[0];
        if (err) setError(err);
      } else {
        setError('Error occured while executing transaction');
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleWithdraw() {
    if (!(address && provider)) {
      console.error('#handleWithdraw: no wallet is connected');
      return;
    }
    if (!props.pool) {
      console.error('#handleWithdraw: pool address is undefined');
      return;
    }
    if (!props.asset) {
      console.error('#handleWithdraw: pool asset is undefined');
      return;
    }
    if (!props.value) {
      console.error('#handleWithdraw: amount input is undefined');
      return;
    }
    const normalized = toNormalizedBn(props.value, decimals);

    if (normalized.raw === BigInt(0)) {
      console.error('#requestWithdraw: amount input is zero');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      // Claim of input amount
      setButton({ text: BUTTON_TEXTS.submitting, disabled: true });
      const redeemHash = await signer?.writeContract({
        account: address,
        address: props.pool,
        abi: ABI_LENDING_POOLS,
        functionName: 'claim',
        // Day, Month, Year, Amount, Address
        args: [BigInt(0), BigInt(0), BigInt(0), normalized.raw, address],
      });
      await toast.promise(
        waitForTransactionReceipt(provider, { hash: redeemHash! }),
        {
          success: {
            render: (
              <Toast
                msg={`Successfully requested ${normalized.normalized} ${symbol} to be withdrawn:`}
                hash={redeemHash}
              />
            ),
            type: 'success',
          },
          error: `Error requesting a ${normalized.normalized} ${symbol} withdrawal`,
          pending: `Submitted withdrawal request for ${normalized.normalized} ${symbol}`,
        },
      );

      // Refetch queries
      queryClient.refetchQueries();

      // Success states
      setIsSuccess(true);
      setButton({ text: BUTTON_TEXTS.success, disabled: true });
      console.log(
        '#requestWithdraw: successfully executed transaction',
        redeemHash,
      );
    } catch (e) {
      console.error(e);
      if (String(e).toLowerCase().includes('user rejected')) {
        toast.warn('User rejected transaction');
        setButton({ text: BUTTON_TEXTS.submit, disabled: false });
      } else {
        toast.error('Error executing transaction');
        setButton({ text: BUTTON_TEXTS.error, disabled: true });
      }
      if (String(e).includes(':')) {
        const err = String(e)?.split(':')[0];
        if (err) setError(err);
      } else {
        setError('Error occured while executing transaction');
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function simulate() {
    if (!props.value) {
      setExpected((_prev) => ({
        fee: toNormalizedBn(BigInt(0), decimals),
        out: toNormalizedBn(BigInt(0), decimals),
        loading: false,
      }));
      return;
    }
    if (!(provider && props.asset && props.pool && address)) return;
    const normalized = toNormalizedBn(props.value, decimals);

    const out = await readContract(provider, {
      account: address,
      address: props.pool,
      abi: ABI_LENDING_POOLS,
      functionName: 'previewRedeem',
      args: [normalized.raw],
    });

    // TODO: get actual transaction fee
    const fee = BigInt(200000);
    setExpected((_prev) => ({
      fee: toNormalizedBn(fee, decimals),
      out: toNormalizedBn(out, decimals),
      loading: false,
    }));
  }

  function reset() {
    props?.clearInput?.();
    setError('');
    setIsLoading(false);
    setIsSuccess(false);
    setButton({ text: BUTTON_TEXTS.zero, disabled: true });
  }

  // useEffects
  useEffect(() => {
    const val = toNormalizedBn(props.value || '0', decimals);
    if (val.raw === BigInt(0)) {
      setButton({ text: BUTTON_TEXTS.zero, disabled: true });
    } else {
      setButton({ text: BUTTON_TEXTS.submit, disabled: false });
      setError('');
    }
  }, [props.value]);

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    clearTimeout(timeoutRef.current);
    setExpected((_prev) => ({
      ..._prev,
      loading: true,
    }));
    timeoutRef.current = setTimeout(() => simulate(), 500);
    return () => clearTimeout(timeoutRef.current);
  }, [props.value]);

  useEffect(() => {
    if (isSuccess) {
      const timeout = setTimeout(() => {
        reset();
        props?.closeModal?.();
      }, 4000);
      return () => {
        clearTimeout(timeout);
      };
    }
    return () => {};
  }, [isSuccess]);

  return {
    requestWithdraw,
    handleWithdraw,
    button,
    isLoading,
    error,
    isSuccess,
    expected,
  };
}