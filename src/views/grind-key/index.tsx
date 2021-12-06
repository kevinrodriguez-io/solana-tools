import { useEffect, useRef, useState } from 'react';
import { RoundButton } from 'components/RoundButton';
import { SearchIcon } from '@heroicons/react/solid';
import { LabelledInput } from 'components/LabelledInput';
import { Shell } from 'components/layouts/Shell';
import { Subject } from 'rxjs';
import { Terminal } from 'components/Terminal';

const logSubject = new Subject<string>();
const threadPoolSize = window.navigator.hardwareConcurrency;

type PseudoKeyPair = {
  publicKey: string;
  privateKey: number[];
};

/**
 * Even with a thread pool pseudoImplementation,
 * this is still very slow.
 * Let's try to create a WebAssembly module
 * that can grind keys in parallel using https://crates.io/crates/solana-keygen.
 * @param startsWith Start characters.
 * @returns A pseudo keypair.
 */
const grind = async (startsWith: string): Promise<PseudoKeyPair> => {
  logSubject.next('Starting...');
  let validKey: PseudoKeyPair | null = null;
  const start = Date.now();
  let counter = 0;

  // Initialize Thread Pool
  logSubject.next(`Building ThreadPool (${threadPoolSize} Threads)`);
  const threadPool = [...Array(threadPoolSize)].map(
    () => new Worker('./grind.worker.js', { type: 'module' }),
  );

  while (!validKey) {
    const results = await Promise.all(
      threadPool.map(
        (worker) =>
          new Promise<PseudoKeyPair>((resolve) => {
            worker.postMessage('START');
            worker.onmessage = (e) => {
              resolve(e.data as PseudoKeyPair);
            };
          }),
      ),
    );
    counter++;
    validKey =
      results.find(({ publicKey }) => publicKey.startsWith(startsWith)) ?? null;
    if (!validKey) {
      if ((counter * threadPoolSize) % 100 === 0) {
        // 1_000_000
        logSubject.next(
          `Grinded ${counter * threadPoolSize} keys in ${Date.now() - start}ms`,
        );
      }
    }
  }

  // Finish Thread Pool
  threadPool.forEach((worker) => worker.terminate());
  const end = Date.now();
  logSubject.next(`Grinded ${validKey.publicKey} in ${end - start}ms`);
  return validKey;
};

export const GrindKey = () => {
  const [, setIsGrinding] = useState(false);
  const [result, setResult] = useState<PseudoKeyPair | null>(null);
  const [journal, setJournal] = useState('');
  const logBox = useRef<HTMLPreElement>(null!);

  useEffect(() => {
    const subscription = logSubject.subscribe((newLine) => {
      setJournal((journal) => `${journal}${newLine}\n`);
      logBox.current.scrollTop = logBox.current.scrollHeight;
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setIsGrinding(true);
      e.preventDefault();
      const startsWith = e.currentTarget.elements.namedItem(
        'startsWith',
      ) as HTMLInputElement;
      const result = await grind(startsWith.value);
      setResult(result);
    } catch (error: any) {
      logSubject.next(error.message);
    } finally {
      setIsGrinding(false);
    }
  };

  return (
    <Shell title="Grind Key">
      <div className="py-4 px-4 bg-white shadow-2xl rounded-2xl">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Grind Vanity Key 💅🏼
        </h2>
        <div className="text-gray-700 text-xs my-4">
          Due to the current limitations of the JavaScript implementation, this
          is very slow (even using a Threadpool of WebWorkers), please try&nbsp;
          <code>$ solana-keygen grind --starts-with</code>&nbsp; using the
          Solana CLI if you want to grind keys super fast. If you want to go
          hyper fast using CUDA try this:&nbsp;
          <a href="https://github.com/mcf-rocks/solanity">
            https://github.com/mcf-rocks/solanity
          </a>
        </div>
        <form onSubmit={handleSubmit} method="post">
          <div className="flex flex-row items-end">
            <LabelledInput
              label="Starts with"
              placeHolder="KEV"
              name="startsWith"
              type="text"
            />
            <div className="ml-2">
              <RoundButton type="submit">
                <SearchIcon className="h-5 w-5" aria-hidden="true" />
              </RoundButton>
            </div>
          </div>
        </form>
        <Terminal commandName="grind" ref={logBox}>
          {journal}
        </Terminal>
        {result ? (
          <Terminal commandName="grind">
            {JSON.stringify(
              {
                publicKey: result.publicKey,
                privateKey: `[${result.privateKey.join(',')}]`,
              },
              null,
              2,
            )}
          </Terminal>
        ) : null}
      </div>
    </Shell>
  );
};
