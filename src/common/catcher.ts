/* eslint-disable @typescript-eslint/no-explicit-any */
import vscode from 'vscode';

/**
 * ! **只允许用在最后的包裹中！不要用在模块里面**
 *
 * 捕捉器，专门捕捉CTError类型的信息并显示提示
 * @param func
 * @returns
 */
export default <T extends (...args: any[]) => void>(func: T) =>
  async (...args: Parameters<T>): Promise<void> => {
    try {
      await func(...args);
    } catch (error) {
      if (error instanceof Error) {
        vscode.window.showErrorMessage(error.message + error.stack);
      } else {
        vscode.window.showErrorMessage(String(error));
      }
    }
  };
