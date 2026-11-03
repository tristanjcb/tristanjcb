import styles from '@/components/Transition.module.scss';
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className={styles.enter}>{children}</div>;
}
