import { Suspense } from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { migrate } from './src/db/migrate';
import { DataProvider } from './src/providers/DataProvider';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { Loading } from './src/components/Button';
export default function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <SQLiteProvider
            databaseName="focustrail.db"
            onInit={migrate}
            useSuspense
          >
            <DataProvider>
              <StatusBar style="light" />
              <AppNavigator />
            </DataProvider>
          </SQLiteProvider>
        </Suspense>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
