"use client"

export function CustomCss({ css }: { css: string }) {
  return <style dangerouslySetInnerHTML={{ __html: css }} />
}

