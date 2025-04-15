import i18next from 'i18next';

/**
 * 获取国际化消息
 * 
 * 这个帮助函数用于在算法文件中处理国际化
 * 因为算法文件不是React组件，不能使用useTranslation hook
 * 
 * @param key 翻译键
 * @param options 插值参数
 * @returns 翻译后的消息
 */
export const getI18nMessage = (key: string, options?: Record<string, any>): string => {
  return i18next.t(key, options);
}; 