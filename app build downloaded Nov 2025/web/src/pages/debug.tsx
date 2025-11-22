import { useEffect, useState } from 'react';
import Head from 'next/head';
import { request, endpoints } from '@/api';

export default function Debug() {
  const [apiUrl, setApiUrl] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    setApiUrl(process.env.NEXT_PUBLIC_API_URL || 'Not set');
  }, []);

  const testAPI = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      console.log('Testing API connection...');
      const response = await request.get(endpoints.get_general_settings);
      setTestResult({ success: true, data: response });
      console.log('✅ API Test Success:', response);
    } catch (error: any) {
      setTestResult({ success: false, error: error });
      console.error('❌ API Test Failed:', error);
    } finally {
      setTesting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Debug - API Connection Test</title>
      </Head>
      
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">🔧 Debug Information</h1>
          
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Environment</h2>
            <div className="space-y-2 font-mono text-sm">
              <div><strong>API URL:</strong> {apiUrl}</div>
              <div><strong>Environment:</strong> {process.env.NEXT_PUBLIC_ENV || 'production'}</div>
              <div><strong>Base Path:</strong> {process.env.NODE_ENV === 'production' ? '/rejuvena' : '/'}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">API Connection Test</h2>
            <button
              onClick={testAPI}
              disabled={testing}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {testing ? 'Testing...' : 'Test API Connection'}
            </button>
            
            {testResult && (
              <div className={`mt-4 p-4 rounded ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <h3 className="font-semibold mb-2">
                  {testResult.success ? '✅ Success' : '❌ Failed'}
                </h3>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(testResult.success ? testResult.data : testResult.error, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Common Issues</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">❌</span>
                <div>
                  <strong>CORS Error:</strong> Backend server needs to allow requests from <code className="bg-gray-100 px-1">https://seplitza.github.io</code>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">❌</span>
                <div>
                  <strong>Network Error:</strong> API server might be down or unreachable
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <div>
                  <strong>If test passes:</strong> CORS is configured correctly and API is working
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-6 text-center">
            <a href="/" className="text-blue-600 hover:underline">← Back to Home</a>
          </div>
        </div>
      </div>
    </>
  );
}
