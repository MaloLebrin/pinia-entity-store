import{_ as s,o as e,c as a,O as n}from"./chunks/framework.4afe7240.js";const u=JSON.parse('{"title":"Getters","description":"","frontmatter":{},"headers":[],"relativePath":"api/functions/getters.md","filePath":"api/functions/getters.md"}'),t={name:"api/functions/getters.md"},o=n(`<h1 id="getters" tabindex="-1">Getters <a class="header-anchor" href="#getters" aria-label="Permalink to &quot;Getters&quot;">​</a></h1><h2 id="getone" tabindex="-1">GetOne <a class="header-anchor" href="#getone" aria-label="Permalink to &quot;GetOne&quot;">​</a></h2><p>▸ <strong>getOne</strong>(<code>id: string | number</code>): <code>T | null</code></p><p>return the entity received based on id passed in argument</p><h4 id="returns" tabindex="-1">Returns <a class="header-anchor" href="#returns" aria-label="Permalink to &quot;Returns&quot;">​</a></h4><p><code>entity: T | null</code></p><p><strong><code>Example</code></strong></p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> userStore </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">useUserStore</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">userStore</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getOne</span><span style="color:#A6ACCD;">(</span><span style="color:#F78C6C;">1</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><h2 id="getmany" tabindex="-1">GetMany <a class="header-anchor" href="#getmany" aria-label="Permalink to &quot;GetMany&quot;">​</a></h2><p>▸ <strong>getMany</strong>(<code>id: string | null[]</code>): <code>T[] | null</code></p><p>return entities received based on id passed in argument</p><h4 id="returns-1" tabindex="-1">Returns <a class="header-anchor" href="#returns-1" aria-label="Permalink to &quot;Returns&quot;">​</a></h4><p><code>entity: T[] | null</code></p><p><strong><code>Example</code></strong></p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> userStore </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">useUserStore</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">userStore</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getMany</span><span style="color:#A6ACCD;">([</span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">3</span><span style="color:#A6ACCD;">])</span></span></code></pre></div><h2 id="getall" tabindex="-1">GetAll <a class="header-anchor" href="#getall" aria-label="Permalink to &quot;GetAll&quot;">​</a></h2><p>▸ <strong>getAll</strong>: <code>Record&lt;number, Entity&gt;</code></p><p>return all entities in store</p><h4 id="returns-2" tabindex="-1">Returns <a class="header-anchor" href="#returns-2" aria-label="Permalink to &quot;Returns&quot;">​</a></h4><p><code>Record&lt;number, Entity&gt;</code></p><p><strong><code>Example</code></strong></p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> userStore </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">useUserStore</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">userStore</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">getAll</span></span></code></pre></div><h2 id="getallarray" tabindex="-1">GetAllArray <a class="header-anchor" href="#getallarray" aria-label="Permalink to &quot;GetAllArray&quot;">​</a></h2><p>▸ <strong>getAllArray</strong>: <code>Entity[]</code></p><p>return an array of all entities in store</p><h4 id="returns-3" tabindex="-1">Returns <a class="header-anchor" href="#returns-3" aria-label="Permalink to &quot;Returns&quot;">​</a></h4><p><code>Entity[]</code></p><p><strong><code>Example</code></strong></p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> userStore </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">useUserStore</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">userStore</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">getAllArray</span></span></code></pre></div><h2 id="getallids" tabindex="-1">GetAllIds <a class="header-anchor" href="#getallids" aria-label="Permalink to &quot;GetAllIds&quot;">​</a></h2><p>▸ <strong>getAllIds</strong>: <code>string | number[]</code></p><p>return all ids for entities in the store as number[]</p><h4 id="returns-4" tabindex="-1">Returns <a class="header-anchor" href="#returns-4" aria-label="Permalink to &quot;Returns&quot;">​</a></h4><p><code>string | number[]</code></p><p><strong><code>Example</code></strong></p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> userStore </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">useUserStore</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">userStore</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">getAllIds</span></span></code></pre></div><h2 id="getmissingsids" tabindex="-1">GetMissingsIds <a class="header-anchor" href="#getmissingsids" aria-label="Permalink to &quot;GetMissingsIds&quot;">​</a></h2><p>▸ <strong>getMissingsIds</strong>(<code>ids: string | number[], canHaveDuplicates?: boolean</code>): <code>string | number[]</code></p><p>returns a list of missing IDs in the store compared to the ids passed to the getter. with an option to filter out duplicates</p><h4 id="returns-5" tabindex="-1">Returns <a class="header-anchor" href="#returns-5" aria-label="Permalink to &quot;Returns&quot;">​</a></h4><p><code>string | number[]</code></p><p><strong><code>Example</code></strong></p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> userStore </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">useUserStore</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">userStore</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getMissingIds</span><span style="color:#A6ACCD;">([</span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">3</span><span style="color:#A6ACCD;">])</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Be default the function will return uniq ids</p></div><h2 id="getmissingsentities" tabindex="-1">GetMissingsEntities <a class="header-anchor" href="#getmissingsentities" aria-label="Permalink to &quot;GetMissingsEntities&quot;">​</a></h2><p>▸ <strong>getMissingsEntities</strong>(<code>entities: T[]</code>): <code>T[]</code></p><p>returns a list of missing entities in the store compared to the entities passed to the getter.</p><h4 id="returns-6" tabindex="-1">Returns <a class="header-anchor" href="#returns-6" aria-label="Permalink to &quot;Returns&quot;">​</a></h4><p><code>T[]</code></p><p><strong><code>Example</code></strong></p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> userStore </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">useUserStore</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">userStore</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getMissingsEntities</span><span style="color:#A6ACCD;">([</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">id</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">firstName</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">John</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">lastName</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">Doe</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">id</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">2</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">firstName</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">Jane</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#F07178;">lastName</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">Doe</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">])</span></span></code></pre></div><h2 id="getwhere" tabindex="-1">GetWhere <a class="header-anchor" href="#getwhere" aria-label="Permalink to &quot;GetWhere&quot;">​</a></h2><p>▸ <strong>getWhere</strong>(<code>filter: (arg: T) =&gt; boolean | null</code>): <code>Record&lt;string | number, T&gt;</code></p><p>Get all the items that pass the given filter callback as a dictionnary of values.</p><h4 id="returns-7" tabindex="-1">Returns <a class="header-anchor" href="#returns-7" aria-label="Permalink to &quot;Returns&quot;">​</a></h4><p><code>Record&lt;string | number, T&gt;</code></p><p><strong><code>Example</code></strong></p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> userStore </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">useUserStore</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">userStore</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getWhere</span><span style="color:#A6ACCD;">(</span><span style="color:#A6ACCD;font-style:italic;">user</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> user</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">id </span><span style="color:#89DDFF;">===</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">1</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><h2 id="getwherearray" tabindex="-1">GetWhereArray <a class="header-anchor" href="#getwherearray" aria-label="Permalink to &quot;GetWhereArray&quot;">​</a></h2><p>▸ <strong>getWhereArray</strong>(<code>filter: (arg: T) =&gt; boolean | null</code>): <code>T[]</code></p><p>Get all the items that pass the given filter callback as an array of values</p><h4 id="returns-8" tabindex="-1">Returns <a class="header-anchor" href="#returns-8" aria-label="Permalink to &quot;Returns&quot;">​</a></h4><p><code>T[]</code></p><p><strong><code>Example</code></strong></p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> userStore </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">useUserStore</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">userStore</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getWhereArray</span><span style="color:#A6ACCD;">(</span><span style="color:#A6ACCD;font-style:italic;">user</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> user</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">id </span><span style="color:#89DDFF;">===</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">1</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><h2 id="getisempty" tabindex="-1">GetIsEmpty <a class="header-anchor" href="#getisempty" aria-label="Permalink to &quot;GetIsEmpty&quot;">​</a></h2><p>▸ <strong>getIsEmpty</strong>(): <code>boolean</code></p><p>Returns a boolean indicating wether or not the state is empty (contains no items).</p><h4 id="returns-9" tabindex="-1">Returns <a class="header-anchor" href="#returns-9" aria-label="Permalink to &quot;Returns&quot;">​</a></h4><p><code>boolean</code></p><p><strong><code>Example</code></strong></p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> userStore </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">useUserStore</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">userStore</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">getIsEmpty</span></span></code></pre></div><h2 id="getisnotempty" tabindex="-1">GetIsNotEmpty <a class="header-anchor" href="#getisnotempty" aria-label="Permalink to &quot;GetIsNotEmpty&quot;">​</a></h2><p>▸ <strong>getIsNotEmpty</strong>(): <code>boolean</code></p><p>Returns a boolean indicating wether or not the state is not empty (contains items).</p><h4 id="returns-10" tabindex="-1">Returns <a class="header-anchor" href="#returns-10" aria-label="Permalink to &quot;Returns&quot;">​</a></h4><p><code>boolean</code></p><p><strong><code>Example</code></strong></p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> userStore </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">useUserStore</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">userStore</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">getIsNotEmpty</span></span></code></pre></div><h2 id="getcurrent" tabindex="-1">GetCurrent <a class="header-anchor" href="#getcurrent" aria-label="Permalink to &quot;GetCurrent&quot;">​</a></h2><p>▸ <strong>getCurrent</strong>(): <code>T | null</code></p><p>current entity stored in state</p><h4 id="returns-11" tabindex="-1">Returns <a class="header-anchor" href="#returns-11" aria-label="Permalink to &quot;Returns&quot;">​</a></h4><p><code>T | null</code></p><p><strong><code>Example</code></strong></p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> userStore </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">useUserStore</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">userStore</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">getCurrent</span></span></code></pre></div><h2 id="getactive" tabindex="-1">GetActive <a class="header-anchor" href="#getactive" aria-label="Permalink to &quot;GetActive&quot;">​</a></h2><p>▸ <strong>getActive</strong>(): <code>string | null []</code></p><p>Array of active entities stored in state</p><h4 id="returns-12" tabindex="-1">Returns <a class="header-anchor" href="#returns-12" aria-label="Permalink to &quot;Returns&quot;">​</a></h4><p><code>string | null []</code></p><p><strong><code>Example</code></strong></p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> userStore </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">useUserStore</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">userStore</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">getActive</span></span></code></pre></div><h2 id="getfirstactive" tabindex="-1">GetFirstActive <a class="header-anchor" href="#getfirstactive" aria-label="Permalink to &quot;GetFirstActive&quot;">​</a></h2><p>▸ <strong>getFirstActive</strong>(): <code>T | null</code></p><p>first entity get from array of active entities stored in state</p><h4 id="returns-13" tabindex="-1">Returns <a class="header-anchor" href="#returns-13" aria-label="Permalink to &quot;Returns&quot;">​</a></h4><p><code>T | null</code></p><p><strong><code>Example</code></strong></p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> userStore </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">useUserStore</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">userStore</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">getFirstActive</span></span></code></pre></div><h2 id="isalreadyinstore" tabindex="-1">IsAlreadyInStore <a class="header-anchor" href="#isalreadyinstore" aria-label="Permalink to &quot;IsAlreadyInStore&quot;">​</a></h2><p>▸ <strong>isAlreadyInStore</strong>(<code>id: string | number</code>): <code>boolean</code></p><p>Return a boolean indicating wether or not the state contains entity.</p><h4 id="returns-14" tabindex="-1">Returns <a class="header-anchor" href="#returns-14" aria-label="Permalink to &quot;Returns&quot;">​</a></h4><p><code>boolean</code></p><p><strong><code>Example</code></strong></p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> userStore </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">useUserStore</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">userStore</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">isAlreadyInStore</span><span style="color:#A6ACCD;">(</span><span style="color:#F78C6C;">1</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><h2 id="isalreadyactive" tabindex="-1">IsAlreadyActive <a class="header-anchor" href="#isalreadyactive" aria-label="Permalink to &quot;IsAlreadyActive&quot;">​</a></h2><p>▸ <strong>isAlreadyActive</strong>(<code>id: string | number</code>): <code>boolean</code></p><p>Return a boolean indicating wether or not the active state contains entity.</p><h4 id="returns-15" tabindex="-1">Returns <a class="header-anchor" href="#returns-15" aria-label="Permalink to &quot;Returns&quot;">​</a></h4><p><code>boolean</code></p><p><strong><code>Example</code></strong></p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> userStore </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">useUserStore</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">userStore</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">isAlreadyActive</span><span style="color:#A6ACCD;">(</span><span style="color:#F78C6C;">1</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><h2 id="isdirty" tabindex="-1">IsDirty <a class="header-anchor" href="#isdirty" aria-label="Permalink to &quot;IsDirty&quot;">​</a></h2><p>▸ <strong>isDirty</strong>(<code>id: string | number</code>): <code>boolean</code></p><p>Return a boolean indicating wether or not the entity has been modified.</p><h4 id="returns-16" tabindex="-1">Returns <a class="header-anchor" href="#returns-16" aria-label="Permalink to &quot;Returns&quot;">​</a></h4><p><code>boolean</code></p><p><strong><code>Example</code></strong></p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> userStore </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">useUserStore</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">userStore</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">isDirty</span><span style="color:#A6ACCD;">(</span><span style="color:#F78C6C;">1</span><span style="color:#A6ACCD;">)</span></span></code></pre></div><h2 id="search" tabindex="-1">search <a class="header-anchor" href="#search" aria-label="Permalink to &quot;search&quot;">​</a></h2><p>▸ <strong>search</strong>(<code>fieldValue: string</code>): <code>T[]</code></p><p>Return a list of entities which contains the character string</p><h4 id="returns-17" tabindex="-1">Returns <a class="header-anchor" href="#returns-17" aria-label="Permalink to &quot;Returns&quot;">​</a></h4><p><code>boolean</code></p><p><strong><code>Example</code></strong></p><div class="language-ts"><button title="Copy Code" class="copy"></button><span class="lang">ts</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> userStore </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">useUserStore</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">userStore</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">search</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">john</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;">)</span></span></code></pre></div>`,128),l=[o];function r(p,c,i,d,A,y){return e(),a("div",null,l)}const h=s(t,[["render",r]]);export{u as __pageData,h as default};